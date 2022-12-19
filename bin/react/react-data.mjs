import fs from "fs";
import path from "path";
import {DIRNAME} from "../helpers/globals/globals.js";
import {files} from "../helpers/files.mjs";
import chalk from "chalk";

export const reactData = {
  create: name => {
    createDataFolder(name);
    console.log(chalk.green("Data file created at src/utils/data..."));
  },
};

function createDataFolder(name) {
  const settings = files.readSettingsJson();
  let createdPath = files.copyFolder(
    path.resolve(getSourcePath(), "data", "example.ts"),
    path.join(getDestPath(), "data", `${name}.${settings.hasTs ? "ts" : "js"}`)
  );
  files.replaceInFiles(createdPath, "example", name);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "react", "examples", "utils");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "utils");
}
