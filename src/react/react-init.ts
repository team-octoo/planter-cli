import {detect} from "../helpers/detect";
import settings from "../utils/settings";
import inquirer from "inquirer";
import chalk from "chalk";
import {files} from "../helpers/files";
import {install} from "../helpers/install";
import path from "path";
import fs from "fs";
import {DIRNAME} from "../globals";
import {docs} from "../helpers/docs";
import {execSync} from "child_process";
import {getComponentStructureConfig} from "../helpers/structure-type";
import {layoutTypes} from "../helpers/migrator";

export const reactInit = {
  installLib: projectName => {
    if (process.platform === "win32") {
      console.log(
        chalk.bgRedBright("Windows detected. If the installation of React stalls, please press enter again.")
      );
    }
    execSync("npm create vite@latest " + projectName + " -- --template react-ts", {
      stdio: [0, 1, 2],
    });
  },
  initialise: () => {
    detect
      .installer()
      .then(installer => {
        if (installer === "unknown") {
          return inquirer
            .prompt([
              {
                type: "list",
                name: "packageManager",
                message: "Choose which package manager you'd like to use:",
                choices: ["NPM", "Yarn"],
              },
            ])
            .then(packageManager => {
              switch (packageManager.packageManager) {
                case "NPM":
                  console.log(chalk.yellow("Installing packages."));
                  execSync("npm install", {stdio: [0, 1, 2]});
                  console.log(chalk.green("Finished installing packages."));
                  return;
                case "Yarn":
                  console.log(chalk.yellow("Installing packages."));
                  execSync("yarn", {stdio: [0, 1, 2]});
                  console.log(chalk.green("Finished installing packages."));
                  return;
                default:
                  return;
              }
            });
        }
        return;
      })
      .then(() => {
        return detect.typescript();
      })
      .then((hasTs: boolean) => {
        settings.hasTs = hasTs;
        return detect.installer();
      })
      .then(installer => {
        settings.installer = installer as any;
        return inquirer.prompt([
          {
            type: "list",
            name: "structure",
            message: "Choose which component folder structure you'd like to use:",
            choices: ["BEP (recommended)", "Atomic", "Custom"],
          },
        ]);
      })
      .then(structure => {
        settings.structure = structure.structure;
        settings.components = getComponentStructureConfig(settings.structure);
        return inquirer.prompt([
          {
            type: "list",
            name: "layout",
            message: "Choose which layout method you'd like to use in components:",
            choices: layoutTypes,
          },
        ]);
      })
      .then(layout => {
        settings.layout = layout.layout;
        return inquirer.prompt([
          {
            type: "confirm",
            name: "proptypes",
            message: "Will you use prop-types?",
            default: false,
          },
        ]);
      })
      .then(usePropTypes => {
        settings.usePropTypes = usePropTypes.proptypes;
        return inquirer.prompt([
          {
            type: "checkbox",
            name: "packages",
            message: "Choose which tech/packages you'd like to use in this project:",
            choices: [
              "Error-boundary",
              "React-router",
              "Wouter",
              "Vitest",
              "Mock-service-worker",
              "Tailwind",
              "Zustand",
              "Redux",
              "i18next",
              "Axios",
              "React-Query",
              // "GraphQL",
              "Cypress",
              "Patch-Package",
              "Prop-types",
            ],
          },
        ]);
      })
      .then(packages => {
        settings.packages = packages.packages;
        if (packages.packages.indexOf("Mock-service-worker") !== -1) {
          settings.mswPath = "src/mocks/endpoints";
        }
        return detect.packageName();
      })
      .then(pName => {
        settings.name = pName as any;
        return inquirer.prompt([
          {
            type: "confirm",
            name: "prettier",
            message: "Would you like to use the Planter prettier file?",
            default: true,
          },
        ]);
      })
      .then(pretty => {
        if (pretty.prettier === true) {
          fs.copyFileSync(path.join(DIRNAME, "..", ".prettierrc"), path.join(process.cwd(), ".prettierrc"));
        }
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
        console.log("");
        console.log("");
        if (settings.packages.includes("React-Query")) {
          console.log(chalk.magentaBright("Don't forget to wrap your app a QueryProvider to start using React Query:"));
          console.log("https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider");
          console.log("");
          console.log("");
        }
        console.log(chalk.greenBright("✨  Planter successfuly finished!  ✨"));
        console.log("");
        console.log("");
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};
