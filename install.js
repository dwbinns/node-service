import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { userInfo } from "node:os";
import { readPackageJSON } from "./packageJSON.js";
import { sudo } from "./sudo.js";


export async function install(serviceName, username) {

    sudo();

    let currentUser = userInfo().username;

    let workingDirectory = process.cwd();

    let packageJSON = await readPackageJSON();

    let name = packageJSON.service?.name || packageJSON.name.split("/").at(-1);

    const node = process.argv0;

    const capabilities = packageJSON.service?.capabilities;
    //CAP_NET_BIND_SERVICE to bind low ports

    const start = packageJSON.service?.start || ". service";

    serviceName ||= name;
    username ||= currentUser;

    const unitFileContent = `
[Unit]
Description=${serviceName}

[Service]
ExecStart=${node} ${start}
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

    let unitFile = `/etc/systemd/system/${serviceName}.service`;

    writeFileSync(unitFile, unitFileContent);

    execFileSync("chmod", ["u=rw,og=r", unitFile]);
    execFileSync("systemctl", ["enable", serviceName]);
    execFileSync("systemctl", ["start", serviceName]);
}

export async function uninstall(serviceName) {
    let packageJSON = await readPackageJSON();

    let name = packageJSON.service?.name || packageJSON.name.split("/").at(-1);

    serviceName ||= name;

    sudo();

    execFileSync("systemctl", ["stop", serviceName]);
    execFileSync("systemctl", ["disable", serviceName]);

}

export async function journal(serviceName) {
    let packageJSON = await readPackageJSON();

    let name = packageJSON.service?.name || packageJSON.name.split("/").at(-1);

    serviceName ||= name;

    execFileSync("journalctl", ["-f", "-u", serviceName], { stdio: "inherit" });
}