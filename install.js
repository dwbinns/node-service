#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { userInfo } from "node:os";
import { join } from "node:path";

let currentUser = userInfo().username;

let workingDirectory = process.cwd();

let packageJSON = JSON.parse(await readFile(join(workingDirectory, "package.json"), { encoding: "utf-8" }));



let name = packageJSON.service?.name || packageJSON.name.split("/").at(-1);

const capabilities = packageJSON.service?.capabilities;
//CAP_NET_BIND_SERVICE to bind low ports

const command = packageJSON.service?.command || "service";

let [node, self, serviceName = name, username = currentUser] = process.argv;

const unitFileContent = `
[Unit]
Description=${serviceName}

[Service]
ExecStart=${node} . ${command}
WorkingDirectory=${workingDirectory}
User=${username}
StandardOutput=inherit
StandardError=inherit
Restart=always
${capabilities?.length ? `AmbientCapabilities=${capabilities.join(" ")}` : ''}

[Install]
WantedBy=multi-user.target
`;

console.log("Installing to:", `/etc/systemd/system/${serviceName}.service`);
console.log(unitFileContent);

if (userInfo().uid != 0) {
    execFileSync("sudo", [node, self, serviceName, username]);
    process.exit(0);
}

let unitFile = `/etc/systemd/system/${serviceName}.service`;

writeFileSync(unitFile, unitFileContent);

execFileSync("chmod", ["u=rw,og=r", unitFile]);
execFileSync("systemctl", ["enable", serviceName]);
execFileSync("systemctl", ["start", serviceName]);
