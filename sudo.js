import { spawnSync } from "node:child_process";
import { userInfo } from "node:os";


export function sudo() {
    if (userInfo().uid != 0) {
        console.error("Re-running with sudo", process.argv);
        let { status } = spawnSync("sudo", ["-E", ...process.argv], { stdio: 'inherit' });
        process.exit(status);
    }
}
