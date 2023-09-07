import path from "path";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";
import chalk from "chalk";

export const reactFuncs = {
  create: name => {
    const settings = files.readSettingsJson();
    createFuncsFolder(name);
    console.log(chalk.green("Function file created at " + settings.funcsPath + "."));
  },
};

function createFuncsFolder(name) {
  const settings = files.readSettingsJson();
  let createdPath = path.join(getDestPath(), `${name}.${settings.hasTs ? "ts" : "js"}`);
  files.copyFile(path.resolve(getSourcePath(), "funcs", "example.ts"), createdPath);
  files.replaceInFiles(createdPath, "example", name);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "utils");
}

function getDestPath() {
  const settings = files.readSettingsJson();
  return path.resolve(process.cwd(), ...settings.funcsPath.split("/"));
}
