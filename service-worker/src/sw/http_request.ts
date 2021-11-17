/**
 * Implement the HttpRequest to Canisters Proposal.
 *
 * TODO: Add support for streaming.
 */
import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { validateBody } from './validation';
import * as base64Arraybuffer from 'base64-arraybuffer';
import * as pako from 'pako';

const CANISTER_ID = "jbxh5-eqaaa-aaaae-qaaoq-cai";
const MY_DOMAIN = "ic0.page";

const canisterIdlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    method: IDL.Text,
    url: IDL.Text,
    headers: IDL.Vec(HeaderField),
    body: IDL.Vec(IDL.Nat8),
  });
  const HttpResponse = IDL.Record({
    status_code: IDL.Nat16,
    headers: IDL.Vec(HeaderField),
    body: IDL.Vec(IDL.Nat8),
    // TODO: Support streaming in JavaScript.
  });

  return IDL.Service({
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
  });
};

/**
 * Decode a body (ie. deflate or gunzip it) based on its content-encoding.
 * @param body The body to decode.
 * @param encoding Its content-encoding associated header.
 */
function decodeBody(body: Uint8Array, encoding: string): Uint8Array {
  switch (encoding) {
    case 'identity':
    case '':
      return body;
    case 'gzip':
      return pako.ungzip(body);
    case 'deflate':
      return pako.inflate(body);
    default:
      throw new Error(`Unsupported encoding: "${encoding}"`);
  }
}

/**
 * Box a request, send it to the canister, and handle its response, creating a Response
 * object.
 * @param request The request received from the browser.
 * @returns The response to send to the browser.
 * @throws If an internal error happens.
 */
export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  /**
   * If this is not for us, pass it on.
   */
  if (!url.hostname.endsWith(MY_DOMAIN)) {
    return await fetch(request);
  }

  /**
   * We try to do an HTTP Request query.
   */
  const canisterId = Principal.fromText(CANISTER_ID);
  try {
    const replicaUrl = new URL("https://ic0.app");
    const agent = new HttpAgent({ host: replicaUrl.toString() });
    const actor = Actor.createActor(canisterIdlFactory, {
      agent,
      canisterId: canisterId,
    });
    const requestHeaders: [string, string][] = [];
    request.headers.forEach((value, key) => requestHeaders.push([key, value]));

    // If the accept encoding isn't given, add it because we want to save bandwidth.
    if (!request.headers.has('Accept-Encoding')) {
      requestHeaders.push(['Accept-Encoding', 'gzip, deflate, identity']);
    }

    const httpRequest = {
      method: request.method,
      url: url.pathname + url.search,
      headers: requestHeaders,
      body: [...new Uint8Array(await request.arrayBuffer())],
    };

    const httpResponse: any = await actor.http_request(httpRequest);
    const headers = new Headers();

    let certificate: ArrayBuffer | undefined;
    let tree: ArrayBuffer | undefined;
    let encoding = '';
    for (const [key, value] of httpResponse.headers) {
      switch (key.trim().toLowerCase()) {
        case 'ic-certificate':
          {
          const fields = value.split(/,/);
          for (const f of fields) {
            const [_0, name, b64Value] = [...f.match(/^(.*)=:(.*):$/)].map(x => x.trim());
            const value = base64Arraybuffer.decode(b64Value);

            if (name === 'certificate') {
              certificate = value;
            } else if (name === 'tree') {
              tree = value;
            }
          }
        }
        continue;
        case 'content-encoding':
          encoding = value.trim();
        break;
      }

      headers.append(key, value);
    }

    const body = new Uint8Array(httpResponse.body);
    const identity = decodeBody(body, encoding);

    let bodyValid = false;
    if (certificate && tree) {
      // Try to validate the body as is.
      bodyValid = await validateBody(
        canisterId,
        url.pathname,
        body.buffer,
        certificate,
        tree,
        agent,
        false,
      );

      if (!bodyValid) {
        // If that didn't work, try to validate its identity version. This is for
        // backward compatibility.
        bodyValid = await validateBody(
          canisterId,
          url.pathname,
          identity.buffer,
          certificate,
          tree,
          agent,
          false,
        );
      }
    }
    if (bodyValid) {
      return new Response(identity.buffer, {
        status: httpResponse.status_code,
        headers,
      });
    } else {
      console.error('BODY DOES NOT PASS VERIFICATION');
      return new Response('Body does not pass verification', { status: 500 });
    }
  } catch (e) {
    console.error('Failed to fetch response:', e);
    return new Response(`Failed to fetch response: ${e.toString()}`, { status: 500 });
  }

  console.error(`URL ${JSON.stringify(url.toString())} did not resolve to a canister ID.`);
  return new Response('Could not find the canister ID.', { status: 404 });
}
