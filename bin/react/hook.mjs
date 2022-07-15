import camelcase from "camelcase";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { files } from "../helpers/files.mjs";
import { DIRNAME } from "../helpers/globals/globals.js";

const hook = {
  createHook: async (elementName) => {
    const path = copyDataFolder(elementName);
    replace(path, elementName);
    console.log(chalk.green("Hook file created at src/utils/hooks..."));
  },
}

function copyDataFolder(name) {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  const filename = `use${camelcase(name, {pascalCase: true})}.${settings.hasTs ? "ts" : "js"}`;
  const pathName = path.join(process.cwd(), "src", "utils", "hooks");
  const fullPath = `${pathName}/${filename}`;
  files.directoryExistsOrCreate(pathName);
  fs.copyFileSync(
    path.resolve(DIRNAME, "..", "..", "react", "examples", "utils", "hooks", "useExample.ts"),
   fullPath,
  );
  return fullPath;
}

function replace(path, name) {
  const pascalCase = camelcase(name, {pascalCase: true});
  const camelCaseName = camelcase(name);
  let data = fs.readFileSync(path, "utf8");
  let result = data.replace(/example/g, camelCaseName).replace(/Example/g, pascalCase);
  fs.writeFileSync(path, result, "utf8");
}

export default hook;
