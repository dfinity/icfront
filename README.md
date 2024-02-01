# Custom Service Worker

Service workers as an [HTTP Gateway Protocol implementation](https://github.com/dfinity/http-gateway) on the Internet Computer are deprecated and no longer supported by DFINITY. See the relevant [forum post](https://forum.dfinity.org/t/deprecating-the-service-worker/23401), or [blog post](https://internetcomputer.org/blog/features/deprecating-the-service-worker) for more details on why this happened.

Community members are free to continue using service workers as their HTTP Gateway if they wish, in spite of the many disadvantages that it presents. For this purpose, and for prosterity, this repo will be kept as a public archive, but no code changes will be made.

For an alternative way to host canisters on a custom domain, see the [Internet Computer documentation](https://internetcomputer.org/docs/current/developer-docs/production/custom-domain/).

## Overview

All smart contracts, including Web3 dapps, on the Internet Computer blockchain are secured by the root key. End-to-end security is provided by a service-worker, a proxy embedded in the browser, which verifies the integrity of data downloaded from the Internet Computer blockchain.

This project builds a custom service worker which enables a custom domain with end-to-end security for a specific canister smart contract on the Internet computer blockchain. The service worker can be served as static assets from any internet connected device and after the service worker is loaded, all data is transfered directly between the client and the Internet Computer blockchain.

Ultimately security of any site using standard web technology depends on DNS since control of DNS allows the site to be redirected and enables control of TLS certificates. Consequently for a standard web site trust must be placed at least in the DNS registrar. If the registrar provides static hosting, deployment of a custom service worker can provided end-to-end security for standard Web3 dapps on the Internet Computer blockchain without increasing the number of entities that must be trusted.

Any static hosting solution will work, and additional examples will be forthcoming and are welcome. For now this example uses Google.

Google provides domains and Firebase (Google) provides free hosting and TLS certificates for static sites. Firebase has a free "Spark Plan" which provides a moderate amount of storage and bandwidth, sufficient for loading the custom service worker.

## Prepare the environment

- install npm
- npm install -g firebase-tools
- firebase login

## Prepare front end javascript code to talk directly to the Internet Computer blockchain

- use `createActor(canisterId, { agentOptions: { host: "https://ic0.app" }` in your front end to hardcode the production backennd when creating agents

## Setup the service worker

- in service-worker/src/sw/domains/static.js replace YOUR_DOMAIN with your domain and CANISTER_ID with your domain and canister id
- build the service worker 'cd service-worker;npm run build'
- copy from service-worker/dist-prod to public

### A setup target is provided in the makefile

- `make setup`

## Build the service worker

- `make build`

## Deploy to firebase hosting

- `firebase init`

Select:
◯ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

- `firebase deploy`
- configure your custom domain `https://firebase.google.com/docs/hosting/custom-domain`

  This will require telling firebase about your domain and pointing your DNS to firebase.
  Firebase will automatically generate a TLS certificate.
