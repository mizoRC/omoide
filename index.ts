import { render } from "ink";
import React from "react";
import { parseArgs } from "./src/cli";
import { App } from "./src/ui";

const args = process.argv.slice(2);
const { folder, mode, dryRun } = await parseArgs(args);

render(React.createElement(App, { folder, mode, dryRun }));
