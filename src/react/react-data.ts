import path from "path";
import chalk from "chalk";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";

export const reactData = {
  create: name => {
    createDataFolder(name);
    console.log(chalk.green("Data file created at src/utils/data..."));
  },
};

function createDataFolder(name) {
  const settings = files.readSettingsJson();
  let createdPath = path.join(getDestPath(), "data", `${name}.${settings.hasTs ? "ts" : "js"}`);
  files.copyFile(path.resolve(getSourcePath(), "data", "example.ts"), createdPath);
  files.replaceInFiles(createdPath, "example", name);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "utils");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "utils");
}
