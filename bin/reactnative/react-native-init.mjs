import { detect } from "../helpers/detect.mjs";
import settings from "../utils/settings.mjs";
import { files } from "../helpers/files.mjs";
import { install } from "../helpers/install.mjs";
import { cocoapods } from "./cocoapods.mjs";
import { redux } from "../helpers/files/redux.mjs";
import path from "path";

import inquirer from "inquirer";
import chalk from "chalk";
import { docs } from "../helpers/docs.mjs";
import { fonts } from "./fonts.mjs";

export const reactNativeInit = {
  initialise: () => {
    return detect
      .installer()
      .then((installer) => {
        settings.installer = installer;
        return inquirer.prompt([
          {
            type: "list",
            name: "structure",
            message: "Choose which component folder structure you'd like to use:",
            choices: ["BEP (recommended)", "Atomic", "Custom"],
          },
        ]);
      })
      .then((structure) => {
        settings.structure = structure.structure;
        switch (structure.structure) {
          case "BEP (recommended)":
            settings.components = {
              basics: "folder",
              elements: "folder",
              pages: "folder",
            };
            break;
          case "Atomic":
            settings.components = {
              atoms: "folder",
              molecules: "folder",
              organisms: "folder",
              templates: "folder",
              pages: "folder",
            };
            break;
          case "Custom":
            settings.components = {};
            console.log(
              chalk.yellow("!! After the setup, define your own custom component structure in the config file !!")
            );
            break;
        }
        return inquirer.prompt([
          {
            type: "checkbox",
            name: "packages",
            message: "Choose which tech/packages you'd like to use in this project:",
            choices: ["Redux", "Patch-Package", "Appcenter"],
          },
        ]);
      })
      .then((packages) => {
        settings.packages = packages.packages;
        return detect.packageName();
      })
      .then((pName) => {
        settings.name = pName;
        //CALL A FUNCTION TO USE THE SETTINGS OBJECT TO INSTALL PACKAGES AND CREATE FOLDERS/FILES
        return files.overwriteFile(path.join(process.cwd(), "planter.config.json"), JSON.stringify(settings, null, 2));
      })
      .then(() => {
        return install.full();
      })
      .then(() => {
        return docs.writeDocs(true);
      })
      .then((result) => {
        console.log(chalk.green(result));
        return cocoapods.install();
      }).then((result) => {
        console.log(chalk.green(result));
        return fonts.install();
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  },
};
