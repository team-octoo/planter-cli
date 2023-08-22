import fs from "fs";
import {execSync} from "child_process";
import {packageMap} from "../utils/package-map.mjs";
import chalk from "chalk";
import path from "path";
import {msw} from "./files/msw.mjs";
import {i18n} from "./files/i18n.mjs";
import {redux} from "./files/redux.mjs";
import {postinstall} from "./files/postinstall.mjs";
import {mirage} from "./files/mirage.mjs";
import {files} from "./files.mjs";
import inquirer from "inquirer";
import {appcenter} from "./files/appcenter.mjs";
import {dotenv} from "./files/dotenv.mjs";
import {reactNavigation} from "./files/reactNavigation.mjs";

const getAllFolders = (parentObject, parentFolder) => {
  let folders = [];
  Object.keys(parentObject).forEach(element => {
    if (element === ".") {
      return;
    }
    if (typeof parentObject[element] === "string") {
      folders.push(path.join(parentFolder, element));
    } else {
      folders.push(...getAllFolders(parentObject[element], path.join(parentFolder, element)));
    }
  });
  return folders;
};

export const install = {
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
          folders.push(path.join(process.cwd(), "src", "types"));
        }
        if (settings.packages.indexOf("Redux") !== -1) {
          folders.push(path.join(process.cwd(), "src", "state", "actions"));
          folders.push(path.join(process.cwd(), "src", "state", "store"));
          folders.push(path.join(process.cwd(), "src", "state", "reducers"));
        }
        if (settings.packages.indexOf("Zustand") !== -1) {
          folders.push(path.join(process.cwd(), "src", "state", "stores"));
        }

        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          folders.push(path.join(process.cwd(), "src", "mocks"));
        }
        if (settings.packages.indexOf("i18next") !== -1) {
          folders.push(path.join(process.cwd(), "src", "locales"));
        }
        if (settings.packages.indexOf("MirageJS") !== -1) {
          folders.push(path.join(process.cwd(), "src", "mocks"));
        }

        folders.push(path.join(process.cwd(), "src", "assets", "images"));
        folders.push(path.join(process.cwd(), "src", "assets", "fonts"));
        folders.push(path.join(process.cwd(), "src", "assets", "misc"));
        folders.push(path.join(process.cwd(), "src", "utils", "data"));
        folders.push(path.join(process.cwd(), "src", "utils", "funcs"));
        folders.push(path.join(process.cwd(), "src", "utils", "hooks"));
        folders.push(path.join(process.cwd(), "src", "state", "contexts"));

        folders.push(...getAllFolders(settings.components, path.join(process.cwd(), "src", "components")));

        folders.forEach(folderpath => {
          fs.mkdirSync(folderpath, {recursive: true}, err => {
            if (err) reject(err);
          });
          fs.writeFileSync(path.join(folderpath, "README.md"), "Autocreated by planter. You may delete this file.");
        });

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

        // if styled components ... add to packages
        if (settings.layout === "Styled-components") {
          packages.push("styled-components");
        }

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
