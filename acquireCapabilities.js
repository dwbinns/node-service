import { spawnSync } from "node:child_process";
import { userInfo } from 'node:os';
import { readPackageJSON } from "./packageJSON.js";
import { sudo } from "./sudo.js";


export function acquireCapabilities(capabilities, args = process.argv.slice(1)) {
    if (!args.length) {
        throw new Error("Supply script and arguments to run");
    }
    sudo();

    const run = [
        "capsh",
        "--keep=1",
        `--user=${process.env.SUDO_USER || userInfo().username}`,
        `--inh=${capabilities.join(",")}`,
        `--addamb=${capabilities.join(",")}`,
        `--shell=${process.execPath}`,
        "--",
        ...process.execArgv,
        ...args,
    ];

    console.log("Acquiring capability:", capabilities);
    console.log(run);


    let { status } = spawnSync(
        run[0],
        run.slice(1),
        { stdio: 'inherit' },
    );

    process.exit(status);
}

export async function start(...args) {

    let packageJSON = await readPackageJSON();

    const capabilities = packageJSON.service?.capabilities;

    const run = args.length ? args : (packageJSON.service?.start || '. service').split(" ");

    acquireCapabilities(capabilities, run);
}
