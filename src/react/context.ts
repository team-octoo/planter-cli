import {files} from "../helpers/files";
import camelcase from "camelcase";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import {DIRNAME} from "../globals";

const context = {
  createContext: async elementName => {
    const settings = files.readSettingsJson();
    const path = copyDataFolder(elementName);
    replace(path, elementName);
    console.log(chalk.green("Context file created at " + settings.contextPath + "..."));
  },
};

function copyDataFolder(name) {
  const settings = files.readSettingsJson();
  const filename = `${camelcase(name, {pascalCase: true})}Context.${settings.hasTs ? "ts" : "js"}`;
  const pathName = path.join(process.cwd(), ...settings.contextPath.split("/"));
  const fullPath = `${pathName}/${filename}`;
  files.directoryExistsOrCreate(pathName);
  fs.copyFileSync(path.resolve(DIRNAME, "react", "examples", "state", "contexts", "ExampleContext.ts"), fullPath);
  return fullPath;
}

function replace(path, name) {
  const pascalCase = camelcase(name, {pascalCase: true});
  const camelCaseName = camelcase(name);
  let data = fs.readFileSync(path, "utf8");
  let result = data.replace(/example/g, camelCaseName).replace(/Example/g, pascalCase);
  fs.writeFileSync(path, result, "utf8");
}

export default context;
