build:
	(cd service-worker; npm run build)
	rm -f public/*
	cp service-worker/dist/* public
	firebase deploy

setup:
	echo "update CANSTER_ID and MY_DOMAIN in agent-js/apps/sw-cert/src/sw/http_request.ts"
	read
	$EDITOR service-worker/src/sw/http_request.ts
	mkdir public
	firebase init
