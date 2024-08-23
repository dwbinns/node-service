# node-service

Install Linux systemd node services, optionally requiring capabilities such as `CAP_NET_BIND_SERVICE`.

The service will run as your user and in the current working directory.

## Example

Add this to package.json:

```json
    "service": {
        "capabilities": [
            "CAP_NET_BIND_SERVICE"
        ],
        "start": "src/index.js service"
    },
    "scripts": {
        "start": "node-service start",
        "install-service": "node-service install",
        "uninstall-service": "node-service uninstall",
        "journal-service": "node-service journal"
    }
```

- run interactively with `CAP_NET_BIND_SERVICE` : `npm start`
- install a systemd service: `npm run install`
- uninstall with: `npm run uninstall`
- watch the systemd service journal: `npm run journal`


