#!/usr/bin/env node

import { start } from "./acquireCapabilities.js";
import { install, uninstall, journal } from "./install.js";

function help() {
    console.log("node-service install [service-name [user-name]]");
    console.log("node-service uninstall [service-name]");
    console.log("node-service journal [service-name]");
    console.log("node-service start [script args...]");
}

const commands = { start, install, uninstall, journal, help };

const [command, ...args] = process.argv.slice(2);

await (commands[command] || help)(...args);


