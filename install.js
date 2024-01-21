#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { userInfo } from "node:os";

let currentUser = userInfo().username;

let [node, self, serviceName, username = currentUser] = process.argv;

let workingDirectory = process.cwd();

if (userInfo().uid != 0) {
    execFileSync("sudo", [node, self, serviceName, username]);
    process.exit(0);
}

let unitFile = `/etc/systemd/system/${serviceName}.service`;

writeFileSync(unitFile, `
[Unit]
Description=${serviceName}

[Service]
ExecStart=${node} . service
WorkingDirectory=${workingDirectory}
User=${username}
StandardOutput=inherit
StandardError=inherit
Restart=always
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
`);

execFileSync("chmod", ["u=rw,og=r", unitFile]);
execFileSync("systemctl", ["enable", serviceName]);
execFileSync("systemctl", ["start", serviceName]);
