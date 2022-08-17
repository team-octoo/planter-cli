import { detect } from "../helpers/detect.mjs";
import settings from "../utils/settings.mjs";
import inquirer from "inquirer";
import chalk from "chalk";
import { files } from "../helpers/files.mjs";
import { install } from "../helpers/install.mjs";
import path from "path";
import { docs } from "../helpers/docs.mjs";

export const reactInit = {
  initialise: () => {
    detect
      .typescript()
      .then((hasTs) => {
        settings.hasTs = hasTs;
        return detect.installer();
      })
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
            type: "list",
            name: "layout",
            message: "Choose which layout method you'd like to use in components:",
            choices: ["CSS", "SASS", "CSS-modules", "SASS-modules", "Styled-components", "Custom"],
          },
        ]);
      })
      .then((layout) => {
        settings.layout = layout.layout;
        return inquirer.prompt([
          {
            type: "checkbox",
            name: "packages",
            message: "Choose which tech/packages you'd like to use in this project:",
            choices: [
              "Error-boundary",
              "Mock-service-worker",
              "React-router",
              "Wouter",
              "Patch-Package",
              "Redux",
              "Zustand",
              "i18next",
              "Axios",
              // "GraphQL",
              "Cypress",
              "Prop-types",
            ],
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
        // document the README.md
        return docs.writeDocs();
      })
      .then(() => {
        console.log(chalk.greenBright("Initialisation has been completed. Have fun creating!"));
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  },
};
