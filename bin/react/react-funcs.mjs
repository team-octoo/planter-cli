import fs from "fs";
import path from "path";
import { DIRNAME } from "../helpers/globals/globals.js";
import { files } from "../helpers/files.mjs";
import chalk from "chalk";

export const reactFuncs = {
  create: (name) => {
    createFuncsFolder(name);
    console.log(chalk.green("Function file created at src/utils/funcs."));
  },
};

function createFuncsFolder(name) {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  let createdPath = files.copyFolder(
    path.resolve(getSourcePath(), "funcs", "example.ts"),
    path.join(getDestPath(), "funcs", `${name}.${settings.hasTs ? "ts" : "js"}`));
  files.replaceInFiles(createdPath, "example", name);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "react", "examples", "utils");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "utils");
}
