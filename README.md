# Secure custom domains for applications on the IC using firebase hosting.

## setup
* install npm
* git clone https://github.com/dfinity/agent-js.git
  Into this directory.
* overwrite `agent-js/apps/sw-cert/src/sw/http_request.ts`
* change the `CANISTER_ID` in overwritten `http_request.ts`
* use `createActor(canisterId, { agentActions: { host: "https://ic0.app" }` in your app to hardcode the production backennd when creating agents

## installation
* npm install -g firebase-tools
* firebase login
* firebase init
 Select:
 ◯ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
* firebase deploy
* configure your custom domain https://firebase.google.com/docs/hosting/custom-domain
  This will require telling firebase about your domain and pointing your DNS to firebase.
