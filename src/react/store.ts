import camelcase from "camelcase";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import {detect} from "../helpers/detect";
import {DIRNAME} from "../globals";
import inquirer from "inquirer";
import {files} from "../helpers/files";

const store = {
  create: async (name, persisted = null) => {
    detect
      .package("zustand")
      .then(() => {
        return inquirer.prompt([
          {
            type: "confirm",
            name: "persisted",
            message: "Does the store need persistence?",
            default: false,
          },
        ]);
      })
      .then(persist => {
        const changeFiles = copyDataFolder(name, persist.persisted);
        replace(changeFiles, name);
        console.log(chalk.green("Store file created..."));
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};

function copyDataFolder(name, persisted) {
  const settings = files.readSettingsJson();

  const pascalCase = camelcase(name, {pascalCase: true});
  const storeFile = `use${persisted ? "Persistent" : ""}${pascalCase}Store.${settings.hasTs ? "ts" : "js"}`;

  const storePathName = path.join(process.cwd(), ...settings.zustandStoresPath.split("/"));
  let storeExamplePathName = path.join(
    settings.hasTs ? "ts" : "js",
    persisted ? "persist" : "nopersist",
    `use${persisted ? "Persistent" : ""}ExampleStore.${settings.hasTs ? "ts" : "js"}`
  );
  const storePath = copyFile(storePathName, storeFile, storeExamplePathName);
  return [storePath];
}

function copyFile(pathName, fileName, exampleFile) {
  const fullPath = path.join(pathName, fileName);
  const localsettings = files.readSettingsJson();
  fs.copyFileSync(
    path.resolve(
      DIRNAME,
      localsettings.library === "react" ? "react" : "reactnative",
      "examples",
      "state",
      "zustand",
      exampleFile
    ),
    fullPath
  );
  return fullPath;
}

function replace(filePaths, name) {
  const pascalCase = camelcase(name, {pascalCase: true});
  const camelCaseName = camelcase(name);
  for (let path of filePaths) {
    let data = fs.readFileSync(path, "utf8");
    let result = data.replace(/example/g, camelCaseName).replace(/Example/g, pascalCase);
    fs.writeFileSync(path, result, "utf8");
  }
  return;
}

export default store;
