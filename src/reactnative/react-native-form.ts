import {files} from "../helpers/files";
import camelcase from "camelcase";
import chalk from "chalk";
import {detect} from "../helpers/detect";
import inquirer from "inquirer";
import {FileType, createFileForComponent, getComponentTypeOptions} from "./react-native-component";

export const form = {
  create: async name => {
    return detect
      .package("react-hook-form")
      .then(() => {
        return detect.package("@hookform/resolvers");
      })
      .then(() => {
        return detect.package("yup");
      })
      .then(() => {
        return inquirer.prompt([
          {
            type: "list",
            name: "option",
            message: "Choose where the component should be located:",
            choices: getComponentTypeOptions(),
          },
        ]);
      })
      .then(async option => {
        let nameWithFormEnd = name;
        if (!name.toLowerCase().endsWith("form")) {
          nameWithFormEnd = nameWithFormEnd + " form";
        }
        const settings = files.readSettingsJson();

        const componentLocations = settings.components[option.option];

        for (const [fileType, pathConfig] of Object.entries(componentLocations)) {
          createFileForComponent(
            fileType as FileType,
            pathConfig,
            camelcase(nameWithFormEnd, {pascalCase: true}),
            true
          );
        }
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};
