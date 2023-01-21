import path from "path";
import fs from "fs";
import camelcase from "camelcase";
import chalk from "chalk";
import {files} from "../helpers/files.mjs";
import {DIRNAME} from "../helpers/globals/globals.js";
import {detect} from "../helpers/detect.mjs";

const mock = {
  create: async name => {
    detect
      .package("msw")
      .then(() => {
        const file = copyDataFolder(name);
        replace(file, name);
        console.log(chalk.green("Mock file created... Don't forget to import it in the handlers file."));
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};

function copyDataFolder(name) {
  const settings = files.readSettingsJson();

  const mockFile = `${name}.${settings.hasTs ? "ts" : "js"}`;

  const mswPath = settings.mswPath.split("/");
  const pathName = path.join(process.cwd(), ...mswPath, name);

  files.directoryExistsOrCreate(pathName);
  return copyFile(pathName, mockFile, "example.js");
}

function copyFile(pathName, fileName, exampleFile) {
  const fullPath = `${pathName}/${fileName}`;
  fs.copyFileSync(path.resolve(DIRNAME, "..", "..", "react", "examples", "msw", "example", exampleFile), fullPath);
  return fullPath;
}

function replace(path, name) {
  const pascalCase = camelcase(name, {pascalCase: true});
  const camelCaseName = camelcase(name);
  let data = fs.readFileSync(path, "utf8");
  let result = data.replace(/example/g, camelCaseName).replace(/Example/g, pascalCase);
  fs.writeFileSync(path, result, "utf8");
}

export default mock;
