import fs from "fs";
import os from "os";
import {execSync} from "child_process";
import {packageMap} from "../utils/package-map";
import chalk from "chalk";
import path from "path";
import {msw} from "./files/msw";
import {i18n} from "./files/i18n";
import {redux} from "./files/redux";
import {postinstall} from "./files/postinstall";
import {mirage} from "./files/mirage";
import {files} from "./files";
import {appcenter} from "./files/appcenter";
import {dotenv} from "./files/dotenv";
import {reactNavigation} from "./files/reactNavigation";
import inquirer from "inquirer";
import settings from "../utils/settings";
import {reactInit} from "../react/react-init";
import {reactNativeInit} from "../reactnative/react-native-init";

const getTopLevelFolders = (parentObject, parentFolder) => {
  let folders = [];
  Object.keys(parentObject).forEach(element => {
    folders.push(path.join(parentFolder, element));
  });
  return folders;
};

export const install = {
  libraryFromConfig: () => {
    console.log(chalk.green("Installing from config file..."));
    const planterSettings = files.readSettingsJson();
    let projectName = process.cwd().split("/").pop();
    process.chdir("../");
    fs.rmSync(path.join(process.cwd(), projectName), {recursive: true, force: true});
    if (planterSettings.library === "react") {
      reactInit.installLib(projectName);
    } else if (planterSettings.library === "react-native") {
      reactNativeInit.installLib(projectName);
    } else {
      throw new Error(chalk.red("Library not found in the planter configuration file."));
    }
    try {
      process.chdir(projectName);
      console.log(JSON.stringify(planterSettings));
      files.overwriteFile(path.join(process.cwd(), "planter.config.json"), JSON.stringify(planterSettings, null, 2));
    } catch (err) {
      throw new Error(err);
    }
  },
  library: () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "projectType",
          message: "Would you like to install React (vite) or React-Native:",
          choices: ["React", "React-Native"],
          default: "React",
        },
        {
          type: "input",
          name: "projectName",
          message: "What is the name of your project:",
          default: "newproject",
        },
      ])
      .then(answers => {
        let projectName = answers.projectName;
        if (projectName === ".") {
          projectName = process.cwd().split("/").pop();
          process.chdir("../");
        }
        if (answers.projectType === "React") {
          settings.library = "react";
          reactInit.installLib(projectName);
        } else if (answers.projectType === "React-Native") {
          settings.library = "react-native";
          reactNativeInit.installLib(projectName);
        }
        try {
          process.chdir(projectName);
          if (settings.library === "react") {
            reactInit.initialise();
          } else if (settings.library === "react-native") {
            reactNativeInit.initialise();
          }
        } catch (err) {
          throw new Error(err);
        }
      });
  },
  full: () => {
    return new Promise((resolve, reject) => {
      return install
        .installPackages()
        .then(result => {
          console.log(chalk.green(result));
          return install.createFolderStructures();
        })
        .then(result => {
          console.log(chalk.green(result));
          return install.copyStarterFiles();
        })
        .then(result => {
          console.log(chalk.green(result));
          return install.setupPackages();
        })
        .then(result => {
          if (result) {
            console.log(chalk.green(result));
          }
          resolve("Project setup done");
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  copyStarterFiles: () => {
    return new Promise((resolve, reject) => {
      try {
        const settings = files.readSettingsJson();
        console.log(chalk.bgYellow("Creating start files..."));
        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          msw.copyFiles();
        }
        if (settings.packages.indexOf("Redux") !== -1) {
          redux.copyFiles();
        }
        if (settings.packages.indexOf("MirageJS") !== -1) {
          mirage.copyFiles();
        }
        if (settings.packages.indexOf("React-Native-Dotenv") !== -1) {
          dotenv.copyFiles();
        }
        if (settings.packages.includes("Navigation-native-stack")) {
          reactNavigation.copyNavigatorFiles("native-stack");
        }
        if (settings.packages.includes("Navigation-tabs")) {
          reactNavigation.copyNavigatorFiles("tab");
        }

        resolve("Files have been written.");
      } catch (err) {
        reject(err);
      }
    });
  },

  createFolderStructures: () => {
    return new Promise((resolve, reject) => {
      try {
        const settings = files.readSettingsJson();
        console.log(chalk.bgYellow("Creating folders..."));
        let folders = [];
        if (settings.hasTs) {
          folders.push(path.join(process.cwd(), ...settings.typesPath.split("/")));
        }
        if (settings.packages.indexOf("Redux") !== -1) {
          folders.push(path.join(process.cwd(), ...settings.reduxActionPath.split("/")));
          folders.push(path.join(process.cwd(), ...settings.reduxStorePath.split("/")));
          folders.push(path.join(process.cwd(), ...settings.reduxReducerPath.split("/")));
        }
        if (settings.packages.indexOf("Zustand") !== -1) {
          folders.push(path.join(process.cwd(), ...settings.zustandStoresPath.split("/")));
        }

        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          folders.push(path.join(process.cwd(), ...settings.mswPath.split("/")));
        }
        if (settings.packages.indexOf("i18next") !== -1) {
          folders.push(path.join(process.cwd(), ...settings.localesPath.split("/")));
        }
        if (settings.packages.indexOf("MirageJS") !== -1) {
          folders.push(path.join(process.cwd(), ...settings.miragePath.split("/")));
        }

        folders.push(path.join(process.cwd(), ...settings.assetImagesPath.split("/")));
        folders.push(path.join(process.cwd(), ...settings.assetFontsPath.split("/")));
        folders.push(path.join(process.cwd(), ...settings.assetMiscPath.split("/")));
        folders.push(path.join(process.cwd(), ...settings.dataPath.split("/")));
        folders.push(path.join(process.cwd(), ...settings.funcsPath.split("/")));
        folders.push(path.join(process.cwd(), ...settings.hookPath.split("/")));
        folders.push(path.join(process.cwd(), ...settings.contextPath.split("/")));

        folders.push(...getTopLevelFolders(settings.components, path.join(process.cwd(), "src", "components")));

        folders.forEach(folderpath => {
          fs.mkdirSync(folderpath, {recursive: true});
          fs.writeFileSync(path.join(folderpath, "README.md"), "Autocreated by planter. You may delete this file.");
        });

        if (settings.packages.indexOf("Vitest") !== -1) {
          const buffer = fs.readFileSync(
            path.join(process.cwd(), settings.hasTs ? "vite.config.ts" : "vite.config.js")
          );
          let fileContent = buffer.toString();
          if (fileContent.indexOf("test: {") === -1) {
            fileContent = fileContent.replace(
              "import { defineConfig } from 'vite'",
              'import {defineConfig} from "vitest/config";'
            );

            fileContent = fileContent.replace(
              "plugins: [react()],",
              "plugins: [react()]," +
                os.EOL +
                "  test: {" +
                os.EOL +
                "    globals: true, " +
                os.EOL +
                '    environment: "jsdom",' +
                os.EOL +
                "    coverage: {" +
                os.EOL +
                '      provider: "istanbul",' +
                os.EOL +
                '      reporter: ["cobertura", "html"],' +
                os.EOL +
                "    }," +
                os.EOL +
                "  },"
            );
            fs.writeFileSync(
              path.join(process.cwd(), settings.hasTs ? "vite.config.ts" : "vite.config.js"),
              fileContent
            );
          }

          const packageBuffer = fs.readFileSync(path.join(process.cwd(), "package.json"));
          let packageContent = packageBuffer.toString();
          if (fileContent.indexOf('"test": "vitest run"') === -1) {
            packageContent = packageContent.replace(
              '"dev": "vite",',
              '"dev": "vite",' +
                os.EOL +
                '    "test": "vitest run",' +
                os.EOL +
                '    "test:watch": "vitest",' +
                os.EOL +
                '    "test:coverage": "vitest run --coverage",'
            );
            fs.writeFileSync(path.join(process.cwd(), "package.json"), packageContent);
          }

          console.log(chalk.green("Vite config file written & added test scripts."));
        }

        resolve("Folders created.");
      } catch (err) {
        reject(err);
      }
    });
  },
  installPackages: () => {
    return new Promise((resolve, reject) => {
      try {
        const settings = files.readSettingsJson();
        console.log(chalk.bgMagentaBright("Sit back and relax. Or get a coffee!!"));
        console.log(chalk.bgYellow("Installing packages..."));
        let packages = [];
        let devpackages = [];

        // iterate over packages to install
        settings.packages.forEach(element => {
          if (packageMap[element]) {
            if (packageMap[element]["no-dev"]) {
              if (settings.hasTs && packageMap[element]["no-dev"]["ts"]) {
                packages = [...packages, ...packageMap[element]["no-dev"]["ts"].packages];
                if (settings.library === "react-native" && packageMap[element]["no-dev"]["ts"]["native-packages"]) {
                  packages = [...packages, ...packageMap[element]["no-dev"]["ts"]["native-packages"]];
                }
              } else if (!settings.hasTs && packageMap[element]["no-dev"]["no-ts"]) {
                packages = [...packages, ...packageMap[element]["no-dev"]["no-ts"].packages];
                if (settings.library === "react-native" && packageMap[element]["no-dev"]["no-ts"]["native-packages"]) {
                  packages = [...packages, ...packageMap[element]["no-dev"]["no-ts"]["native-packages"]];
                }
              }
            }
            if (packageMap[element]["dev"]) {
              if (settings.hasTs && packageMap[element]["dev"]["ts"]) {
                devpackages = [...devpackages, ...packageMap[element]["dev"]["ts"].packages];
                if (settings.library === "react-native" && packageMap[element]["dev"]["ts"]["native-packages"]) {
                  devpackages = [...packages, ...packageMap[element]["dev"]["ts"]["native-packages"]];
                }
              } else if (!settings.hasTs && packageMap[element]["dev"]["no-ts"]) {
                devpackages = [...devpackages, ...packageMap[element]["dev"]["no-ts"].packages];
                if (settings.library === "react-native" && packageMap[element]["dev"]["no-ts"]["native-packages"]) {
                  devpackages = [...packages, ...packageMap[element]["dev"]["no-ts"]["native-packages"]];
                }
              }
            }
          }
        });

        console.log(chalk.yellow("Now installing packages", packages, devpackages));

        // if react-native ... install testing library
        if (settings.library === "react-native") {
          devpackages.push("@testing-library/react-native");
        }

        // NPM
        if (settings.installer === "npm") {
          install.installNPM(packages, devpackages);
        } else if (settings.installer === "yarn") {
          install.installYarn(packages, devpackages);
        }

        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          execSync("npx msw init public/ --save", {stdio: [0, 1, 2]});
        }

        resolve("Packages installed");
      } catch (err) {
        reject(err);
      }
    });
  },

  // installers
  installNPM: (packages, devpackages) => {
    if (packages.length > 0) {
      execSync("npm install " + packages.join(" "), {stdio: [0, 1, 2]});
    }
    if (devpackages.length > 0) {
      execSync("npm install " + devpackages.join(" ") + " --save-dev", {stdio: [0, 1, 2]});
    }
  },
  installYarn: (packages, devpackages) => {
    if (packages.length > 0) {
      execSync("yarn add " + packages.join(" "), {stdio: [0, 1, 2]});
    }
    if (devpackages.length > 0) {
      execSync("yarn add " + devpackages.join(" ") + " --dev", {stdio: [0, 1, 2]});
    }
  },

  setupPackages: () => {
    return new Promise(async (resolve, reject) => {
      const settings = files.readSettingsJson();
      try {
        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          console.log(await install.setupMSWPackage());
        }
        if (settings.packages.indexOf("Redux") !== -1) {
          console.log(await install.setupReduxPackage());
        }
        if (settings.packages.indexOf("Patch-Package") !== -1) {
          console.log(await install.setupPostInstall());
        }
        if (settings.packages.indexOf("i18next") !== -1) {
          console.log(await install.setupI18N());
        }
        if (settings.packages.indexOf("MirageJS") !== -1) {
          console.log(await install.setupMiragePackage());
        }
        if (settings.packages.indexOf("Appcenter") !== -1 && settings.postbuild) {
          console.log(chalk.green(await install.setupAppCenterPreBuildScript()));
        }
        if (settings.packages.indexOf("React-Navigation") !== -1) {
          console.log(chalk.green(await install.setupReactNavigationCore()));
        }
        resolve("Package setup done");
      } catch (e) {
        reject(e);
      }
    });
  },

  //msw setup
  setupMSWPackage: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Setting up msw..."));
      msw
        .setupPackage()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },
  setupI18N: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Setting up i18n..."));
      i18n
        .setup()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  setupMiragePackage: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Setting up Mirage..."));
      mirage
        .setupPackage()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  //redux setup
  setupReduxPackage: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Setting up redux..."));
      redux
        .setupPackage()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  //redux setup
  setupPostInstall: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Setting up PostInstall..."));
      postinstall
        .setupPackage()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  setupAppCenterPreBuildScript: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Creating `AppCenter-Pre-Build.sh`"));
      appcenter
        .setupPreBuildScript()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  setupReactNavigationCore: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Setting up React Navigation"));
      reactNavigation
        .setupPackage()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },
};
