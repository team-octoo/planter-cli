import path from "path";
import fs from "fs";
import camelcase from "camelcase";
import chalk from "chalk";
import {files} from "../helpers/files";
import {DIRNAME} from "../globals";
import {detect} from "../helpers/detect";

const mock = {
  create: async name => {
    detect
      .package("msw")
      .then(() => {
        const file = copyDataFolder(name);
        replace(file, name);
        replaceMockFile(file);
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
  fs.copyFileSync(path.resolve(DIRNAME, "react", "examples", "msw", "example", exampleFile), fullPath);
  return fullPath;
}

function replace(path, name) {
  const pascalCase = camelcase(name, {pascalCase: true});
  const camelCaseName = camelcase(name);
  let data = fs.readFileSync(path, "utf8");
  let result = data.replace(/example/g, camelCaseName).replace(/Example/g, pascalCase);
  fs.writeFileSync(path, result, "utf8");
}

function replaceMockFile(path) {
  const settings = files.readSettingsJson();
  const mswPath = settings.mswPath.split("/");
  let dbLink = "";
  // i == 2 because src and mocks should not be calculated in the path
  for (let i = 2; i < mswPath.length; i++) {
    dbLink = dbLink + "../";
  }
  dbLink = dbLink + "mockDatabase";
  let data = fs.readFileSync(path, "utf8");
  let result = data.replaceAll("../mockDatabase", '"' + dbLink + '"');
  fs.writeFileSync(path, result, "utf8");
}

export default mock;
