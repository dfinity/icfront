build:
	rm -f agent-js/apps/sw-cert/dist/*
	(cd agent-js; npm run build --workspaces --if-present)
	rm -f public/*
	cp agent-js/apps/sw-cert/dist/* public

setup:
	git clone https://github.com/dfinity/agent-js
	cp http_request.ts agent-js/apps/sw-cert/src/sw/http_request.ts
	echo "update CANSTER_ID in agent-js/apps/sw-cert/src/sw/http_request.ts"
	read
	$EDITOR agent-js/apps/sw-cert/src/sw/http_request.ts
	mkdir public
