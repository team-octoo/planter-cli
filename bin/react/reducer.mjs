import {files} from "../helpers/files.mjs";
import camelcase from "camelcase";
import path from "path";
import fs from "fs";
import os from "os";
import chalk from "chalk";
import {detect} from "../helpers/detect.mjs";
import {DIRNAME} from "../helpers/globals/globals.mjs";

const reducer = {
  create: async name => {
    detect
      .package("react-redux")
      .then(() => {
        const changeFiles = copyDataFolder(name);
        replace(changeFiles, name);
        console.log(chalk.green("Reducer and action file created... Don't forget to import it in the RootReducer."));
        addToRootReducer(name);
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};

function addToRootReducer(name) {
  const pascalCaseName = camelcase(name, {pascalCase: true});
  const settings = files.readSettingsJson();

  const buffer = fs.readFileSync(
    path.join(process.cwd(), "src", "state", "reducers", `RootReducer.${settings.hasTs ? "ts" : "js"}`)
  );
  let fileString = buffer.toString();
  fileString = fileString.replace(
    'import { combineReducers } from "redux";',
    'import { combineReducers } from "redux";' +
      os.EOL +
      "import " +
      pascalCaseName +
      'Reducer from "./' +
      pascalCaseName +
      'Reducer";'
  );
  if (fileString.indexOf("const rootReducer = combineReducers({});") !== -1) {
    //first reducer
    fileString = fileString.replace(
      "const rootReducer = combineReducers({",
      "const rootReducer = combineReducers({" +
        os.EOL +
        "  " +
        pascalCaseName +
        "Reducer: " +
        pascalCaseName +
        "Reducer" +
        os.EOL
    );
  } else {
    fileString = fileString.replace(
      "const rootReducer = combineReducers({",
      "const rootReducer = combineReducers({" + os.EOL + "  " + pascalCaseName + ": " + pascalCaseName + "Reducer,"
    );
  }
  fs.writeFileSync(
    path.join(process.cwd(), "src", "state", "reducers", `RootReducer.${settings.hasTs ? "ts" : "js"}`),
    fileString
  );
  return fileString;
}

function copyDataFolder(name) {
  const settings = files.readSettingsJson();

  const pascalCase = camelcase(name, {pascalCase: true});
  const actionsFile = `${pascalCase}Actions.${settings.hasTs ? "ts" : "js"}`;
  const reducerFile = `${pascalCase}Reducer.${settings.hasTs ? "ts" : "js"}`;
  const rootFile = `RootReducer.${settings.hasTs ? "ts" : "js"}`;
  const storeFile = `Store.${settings.hasTs ? "ts" : "js"}`;

  const actionPathName = path.join(process.cwd(), "src", "state", "actions");
  const reducerPathName = path.join(process.cwd(), "src", "state", "reducers");
  // files.directoryExistsOrCreate(pathName);
  const actionPath = copyFile(actionPathName, actionsFile, path.join("actions", "ExampleActions.ts"));
  const reducerPath = copyFile(reducerPathName, reducerFile, path.join("reducers", "ExampleReducer.ts"));
  // copyFile(pathName, rootFile, "RootReducer.js");
  // copyFile(pathName, storeFile, "Store.js");
  return [actionPath, reducerPath];
}

function copyFile(pathName, fileName, exampleFile) {
  const fullPath = `${pathName}/${fileName}`;
  fs.copyFileSync(
    path.resolve(DIRNAME, "..", "..", "react", "examples", "state", "redux", exampleFile),
    `${pathName}/${fileName}`
  );
  return fullPath;
}

function replace(filePaths, name) {
  const pascalCase = camelcase(name, {pascalCase: true});
  const camelCaseName = camelcase(name);
  const uppercase = name.toUpperCase();
  for (let path of filePaths) {
    let data = fs.readFileSync(path, "utf8");
    let result = data
      .replace(/example/g, camelCaseName)
      .replace(/Example/g, pascalCase)
      .replace(/EXAMPLE/g, uppercase);
    fs.writeFileSync(path, result, "utf8");
  }
  return;
}

export default reducer;
