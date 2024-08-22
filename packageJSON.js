import { readFile } from "node:fs/promises";
import { join } from "node:path";


export async function readPackageJSON() {
    return JSON.parse(await readFile(join(process.cwd(), "package.json"), { encoding: "utf-8" }));
}
