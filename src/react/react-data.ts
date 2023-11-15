import path from "path";
import chalk from "chalk";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";

export const reactData = {
  create: name => {
    const settings = files.readSettingsJson();
    createDataFolder(name);
    console.log(chalk.green("Data file created at " + settings.dataPath + "..."));
  },
};

function createDataFolder(name) {
  const settings = files.readSettingsJson();
  let createdPath = path.join(getDestPath(), `${name}.${settings.hasTs ? "ts" : "js"}`);
  files.copyFile(path.resolve(getSourcePath(), "data", "example.ts"), createdPath);
  files.replaceInFiles(createdPath, "example", name);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "utils");
}

function getDestPath() {
  const settings = files.readSettingsJson();
  return path.resolve(process.cwd(), ...settings.dataPath.split("/"));
}
