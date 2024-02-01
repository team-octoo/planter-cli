import inquirer from "inquirer";
import camelcase from "camelcase";
import chalk from "chalk";
import {files} from "../helpers/files";
import path from "path";
import {DIRNAME} from "../globals";
import reducer from "../react/reducer";
import store from "../react/store";

export const dataModel = {
  create: async (
    name: string,
    options: {types: boolean; hooks: boolean; state: "Redux" | "Zustand" | false; parsers: boolean}
  ) => {
    console.log("Creating Data model", name);
    console.log(options);
    return inquirer
      .prompt(
        [
          {
            type: "input",
            name: "name",
            message: "Give your data model a name:",
          },
        ],
        {name: name}
      )
      .then(async ({name}) => {
        const localsettings = files.readSettingsJson();
        if (localsettings.hasTs && options.types) {
          createTypeFile(name, localsettings.typesPath);
        }
        if (options.parsers) {
          createParserFile(name, localsettings.funcsPath, localsettings.hasTs, options.types);
        }
        if (options.hooks) {
          createCRUDHooks(name, localsettings.hookPath, localsettings.hasTs, options.types);
        }
        if (options.state) {
          switch (options.state) {
            case "Redux":
              console.log(chalk.green(`Creating ${camelcase(name, {pascalCase: true})}Reducer...`));
              await reducer.create(name);
              break;
            case "Zustand":
              console.log(chalk.green(`Creating ${camelcase(name, {pascalCase: true})} Store...`));
              await store.create(name);
              break;
          }
        }
        return Promise.resolve();
      });
  },
};

const createTypeFile = (name: string, typesFolder) => {
  const newTypesPath = `${typesFolder}/${camelcase(name)}.d.ts`;
  const examplePath = path.resolve(getTypesSourcePath(), "example.d.ts");
  createNewFile("types", newTypesPath, name, examplePath);
};

const createParserFile = (name: string, funcsFolder: string, typed: boolean, withCreatedTypes: boolean) => {
  const newParserPath = `${funcsFolder}/dataParsers/${camelcase(name)}/${camelcase(name)}Parser.${typed ? "ts" : "js"}`;
  const examplePath = path.resolve(
    getParsersSourcePath(),
    typed ? "ts" : "js",
    `exampleParser${!typed || withCreatedTypes ? "" : "Any"}.${typed ? "ts" : "js"}`
  );
  createNewFile("parser", newParserPath, name, examplePath);
};

const createCRUDHooks = (name: string, hooksFolder: string, typed: boolean, withCreatedTypes: boolean) => {
  //Creation, Update, Delete Hook
  const newCUDHookPath = `${hooksFolder}/${camelcase(name)}/use${camelcase(name, {pascalCase: true})}.${
    typed ? "ts" : "js"
  }`;
  const exampleCUDPath = path.resolve(getHooksSourcePath(), typed ? "ts" : "js", `useExample.${typed ? "ts" : "js"}`);
  createNewFile("hooks", newCUDHookPath, name, exampleCUDPath);

  //Read All hook
  const newReadAllHookPath = `${hooksFolder}/${camelcase(name)}/useGetAll${camelcase(name, {pascalCase: true})}.${
    typed ? "ts" : "js"
  }`;
  const exampleReadAllPath = path.resolve(
    getHooksSourcePath(),
    typed ? "ts" : "js",
    `useGetAll${!typed || withCreatedTypes ? "" : "Any"}Example.${typed ? "ts" : "js"}`
  );
  createNewFile("hooks", newReadAllHookPath, name, exampleReadAllPath);
};

function getTypesSourcePath() {
  return path.resolve(DIRNAME, "reactnative", "examples", "types");
}

function getParsersSourcePath() {
  return path.resolve(DIRNAME, "reactnative", "examples", "utils", "funcs", "parsers");
}

function getHooksSourcePath() {
  return path.resolve(DIRNAME, "reactnative", "examples", "utils", "hooks");
}

function createNewFile(type: string, newpath: string, name: string, examplePath: string) {
  console.log(chalk.green(`Creating ${type} file in ${newpath}`));
  files.fileExistsOrCreate(newpath);
  files.copyFile(examplePath, newpath);
  files.replaceInFiles(newpath, "Example", camelcase(name, {pascalCase: true}));
  files.replaceInFiles(newpath, "example", camelcase(name));
}
