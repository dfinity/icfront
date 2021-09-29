# Secure custom domains for smart contracts on the Internet Computer using firebase hosting.

Firebase (Google) provides free hosting and TLS certificates for static sites.
This project builds a custom service worker which provides end-to-end security
for a canister smart contract on the Internet computer blockchain.

Firebase has a free "Spark Plan" which provides a moderate amount of
storage and bandwidth, sufficient for loading the service worker into many
clients after which all data is transfered directly from the IC to clients.

## Prepare the environment
* install npm
* npm install -g firebase-tools
* firebase login

## Prepare front end javascript code to talk directly to the Internet Computer blockchain
* use `createActor(canisterId, { agentActions: { host: "https://ic0.app" }` in your front end to hardcode the production backennd when creating agents

## Setup the service worker
* git clone https://github.com/dfinity/agent-js.git
  Into this directory.
* cp `http_request.ts` `agent-js/apps/sw-cert/src/sw/http_request.ts`
* change the `CANISTER_ID` in overwritten `http_request.ts`

### A setup target is provided in the makefile
'make setup'

## Build the service worker
'make build'

## Deploy to firebase hosting
* `firebase init`

 Select:
 ◯ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

* `firebase deploy`
* configure your custom domain `https://firebase.google.com/docs/hosting/custom-domain`

  This will require telling firebase about your domain and pointing your DNS to firebase.
  Firebase will automatically generate a TLS certificate.

