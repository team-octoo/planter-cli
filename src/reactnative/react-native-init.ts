import {detect} from "../helpers/detect";
import settings from "../utils/settings";
import {files} from "../helpers/files";
import {install} from "../helpers/install";
import {cocoapods} from "./cocoapods";
import fs from "fs";
import path from "path";

import inquirer from "inquirer";
import chalk from "chalk";
import {docs} from "../helpers/docs";
import {fonts} from "./fonts";
import {intro} from "../helpers/intro";
import {DIRNAME} from "../globals";
import {getComponentStructureConfig} from "../helpers/structure-type";

export const reactNativeInit = {
  initialise: () => {
    return detect
      .typescript()
      .then(hasTs => {
        settings.hasTs = hasTs as any;
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
              "Redux",
              "Zustand",
              "i18next",
              "Patch-Package",
              "Appcenter",
              "MirageJS",
              "React Hook Forms",
              "React-Native-Dotenv",
            ],
          },
        ]);
      })
      .then(packages => {
        settings.packages = packages.packages;
        if (packages.packages.indexOf("Appcenter") !== -1 && packages.packages.indexOf("React-Native-Dotenv") !== -1) {
          return inquirer.prompt([
            {
              type: "confirm",
              name: "postbuild",
              message: "Do you want to add a `appcenter-pre-build` script to the app?",
              default: true,
            },
          ]);
        }
        return Promise.resolve({postbuild: false});
      })

      .then(postBuildScript => {
        settings.postbuild = postBuildScript.postbuild as any;
        return inquirer.prompt([
          {
            type: "list",
            name: "navigation",
            message: "Choose base navigation you want to use in the app:",
            choices: [
              {name: "None (don't install react-navigation)", value: "none"},
              {name: "Stack navigation", value: "stack"},
              {name: "Tab navigation", value: "tab"},
            ],
          },
        ]);
      })
      .then(navigation => {
        if (navigation.navigation === "none") return detect.packageName();
        settings.components.navigation = {
          component: "src/components/navigation/@camelCase",
          style: "src/components/navigation/@camelCase",
          test: "src/components/navigation/tests/@camelCase",
        };
        if (settings.hasTs) {
          settings.components["main-navigation"] = {
            component: "src/components/navigation/MainNavigation/@camelCase",
            style: "src/components/navigation/MainNavigation/@camelCase",
            test: "src/components/navigation/MainNavigation/tests/@camelCase",
          };
        }

        settings.packages.push("React-Navigation");
        switch (navigation.navigation) {
          case "stack":
            settings.packages.push("Navigation-native-stack");
            break;
          case "tab":
            settings.packages.push("Navigation-tabs");
            break;
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
          settings.prettier = true;
          fs.copyFileSync(
            path.join(DIRNAME, "reactnative", "examples", "config", ".prettierrc.cjs"),
            path.join(process.cwd(), ".prettierrc.js")
          );
        }
        //CALL A FUNCTION TO USE THE SETTINGS OBJECT TO INSTALL PACKAGES AND CREATE FOLDERS/FILES
        return files.overwriteFile(path.join(process.cwd(), "planter.config.json"), JSON.stringify(settings, null, 2));
      })
      .then(() => {
        return install.full();
      })
      .then(result => {
        if (result) console.log(chalk.green(result));
        return docs.writeDocs(true);
      })
      .then(result => {
        return cocoapods.install();
      })
      .then(result => {
        if (result) console.log(chalk.green(result));
        return fonts.install();
      })
      .then(result => {
        if (result) console.log(chalk.green(result));
        console.log("");
        console.log("");
        return intro.play(false);
      })
      .then(() => {
        console.log("✨  Planter successfuly finished!  ✨");
        console.log("");
        console.log("");
        if (settings.packages.includes("React-Navigation")) {
          console.log(
            chalk.magentaBright("Don't forget to wrap your app with the Navigation Container:"),
            "https://reactnavigation.org/docs/getting-started/#wrapping-your-app-in-navigationcontainer"
          );
          console.log("");
          console.log("");
        }
      })
      .catch(err => {
        if (err) console.log(chalk.red(err));
      });
  },
};
