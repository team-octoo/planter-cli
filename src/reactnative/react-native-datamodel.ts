import inquirer from "inquirer";
import camelcase from "camelcase";
import chalk from "chalk";
import {files} from "../helpers/files";
import path from "path";
import {DIRNAME} from "../globals";

export const dataModel = {
  create: async (
    name: string,
    options: {getAllHook: boolean; types: boolean; hooks: boolean; state: boolean; parsers: boolean}
  ) => {
    return inquirer
      .prompt(
        [
          {
            type: "input",
            name: "name",
            message: "Give your data model a name:",
          },
          {type: "confirm", name: "getAllHook", message: "add GetAll hook for this data model:", default: true},
        ],
        {name: name, getAllHook: (options.getAllHook && options.hooks) || (!options.hooks ? false : undefined)}
      )
      .then(async ({name, getAllHook}) => {
        console.log(getAllHook);
        const localsettings = files.readSettingsJson();
        if (localsettings.hasTs && options.types) {
          createTypeFile(name, localsettings.typesPath);
        }
        if (options.parsers) {
          createParserFile(name, localsettings.funcsPath, localsettings.hasTs, options.types);
        }
        return Promise.resolve();
      });
  },
};

const createTypeFile = (name: string, typesFolder) => {
  const newTypesPath = `${typesFolder}/${camelcase(name)}.d.ts`;
  console.log(chalk.green(`Creating types in ${newTypesPath}`));
  files.fileExistsOrCreate(newTypesPath);
  files.copyFile(path.resolve(getTypesSourcePath(), "example.d.ts"), newTypesPath);

  files.replaceInFiles(newTypesPath, "Example", camelcase(name, {pascalCase: true}));
  files.replaceInFiles(newTypesPath, "example", camelcase(name));
};

const createParserFile = (name: string, funcsFolder: string, typed: boolean, withCreatedTypes: boolean) => {
  const newParserPath = `${funcsFolder}/dataParsers/${camelcase(name)}/${camelcase(name)}Parser.${typed ? "ts" : "js"}`;
  console.log(chalk.green(`Creating parser in ${newParserPath}`));
  files.fileExistsOrCreate(newParserPath);
  const exampleFile = files.copyFile(
    path.resolve(
      getParsersSourcePath(),
      typed ? "ts" : "js",
      `exampleParser${!typed || withCreatedTypes ? "" : "Any"}.${typed ? "ts" : "js"}`
    ),
    newParserPath
  );

  files.replaceInFiles(newParserPath, "Example", camelcase(name, {pascalCase: true}));
  files.replaceInFiles(newParserPath, "example", camelcase(name));
};

function getTypesSourcePath() {
  return path.resolve(DIRNAME, "reactnative", "examples", "types");
}

function getParsersSourcePath() {
  return path.resolve(DIRNAME, "reactnative", "examples", "utils", "funcs", "parsers");
}
