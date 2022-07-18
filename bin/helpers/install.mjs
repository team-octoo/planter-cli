import fs from "fs";
import { execSync } from "child_process";
import { packageMap } from "../utils/package-map.mjs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { msw } from "./files/msw.mjs";
import { i18n } from "./files/i18n.mjs";
import { redux } from "./files/redux.mjs";
import { postinstall } from "./files/postinstall.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const install = {
  full: () => {
    return new Promise((resolve, reject) => {
      return install
        .installPackages()
        .then((result) => {
          console.log(chalk.green(result));
          return install.createFolderStructures();
        })
        .then((result) => {
          console.log(chalk.green(result));
          return install.copyStarterFiles();
        })
        .then((result) => {
          console.log(chalk.green(result));
          return install.setupPackages();
        })
        .then((result) => {
          console.log(chalk.green(result));
          resolve("Project setup done");
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  copyStarterFiles: () => {
    return new Promise((resolve, reject) => {
      try {
        const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
        console.log("Creating start files...");
        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          msw.copyFiles();
        }
        if (settings.packages.indexOf("Redux") !== -1) {
          redux.copyFiles();
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
        const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
        console.log("Creating folders...");
        let folders = [];
        if (settings.hasTs) {
          folders.push(path.join(process.cwd(), "src", "types"));
        }
        if (settings.packages.indexOf("Redux") !== -1) {
          folders.push(path.join(process.cwd(), "src", "state", "actions"));
          folders.push(path.join(process.cwd(), "src", "state", "store"));
          folders.push(path.join(process.cwd(), "src", "state", "reducers"));
        }

        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          folders.push(path.join(process.cwd(), "src", "mocks"));
        }
        if (settings.packages.indexOf("i18next") !== -1) {
          folders.push(path.join(process.cwd(), "src", "locales"));
        }
        folders.push(path.join(process.cwd(), "src", "assets", "images"));
        folders.push(path.join(process.cwd(), "src", "assets", "fonts"));
        folders.push(path.join(process.cwd(), "src", "assets", "misc"));
        folders.push(path.join(process.cwd(), "src", "utils", "data"));
        folders.push(path.join(process.cwd(), "src", "utils", "funcs"));
        folders.push(path.join(process.cwd(), "src", "utils", "hooks"));
        folders.push(path.join(process.cwd(), "src", "state", "contexts"));

        Object.keys(settings.components).forEach((element) => {
          let folderpath = "";
          // TODO :: NEED IMPROVEMENT TO RECURSIVELY GO THROUGH OBJECTS
          if (typeof element === "string") {
            folderpath = element;
          } else {
            Object.keys(element).forEach((subelement) => {
              folderpath = path.join(element, subelement);
            });
          }

          folders.push(path.join(process.cwd(), "src", "components", folderpath));
        });

        folders.forEach((folderpath) => {
          fs.mkdirSync(folderpath, { recursive: true }, (err) => {
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
        const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
        console.log("Sit back and relax. Or get a coffee!!");
        console.log("Installing packages...");
        let packages = [];
        let devpackages = [];

        // iterate over packages to install
        settings.packages.forEach((element) => {
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

        // NPM
        if (settings.installer === "npm") {
          install.installNPM(packages, devpackages);
        } else if (settings.installer === "yarn") {
          install.installYarn(packages, devpackages);
        }

        if (settings.packages.indexOf("Mock-service-worker") !== -1) {
          execSync("npx msw init public/ --save", { stdio: [0, 1, 2] });
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
      execSync("npm install " + packages.join(" "), { stdio: [0, 1, 2] });
    }
    if (devpackages.length > 0) {
      execSync("npm install " + devpackages.join(" ") + " --save-dev", { stdio: [0, 1, 2] });
    }
  },
  installYarn: (packages, devpackages) => {
    if (packages.length > 0) {
      execSync("yarn add " + packages.join(" "), { stdio: [0, 1, 2] });
    }
    if (devpackages.length > 0) {
      execSync("yarn add " + devpackages.join(" ") + " --dev", { stdio: [0, 1, 2] });
    }
  },

  setupPackages: () => {
    return new Promise(async (resolve, reject) => {
      const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
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
        resolve("Package setup done");
      } catch (e) {
        reject(e);
      }
    });
  },

  //msw setup
  setupMSWPackage: () => {
    return new Promise((resolve, reject) => {
      console.log("Setting up msw...");
      msw
        .setupPackage()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },
  setupI18N: () => {
    return new Promise((resolve, reject) => {
      i18n
        .setup()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  //redux setup
  setupReduxPackage: () => {
    return new Promise((resolve, reject) => {
      console.log("Setting up redux...");
      redux
        .setupPackage()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },

  //redux setup
  setupPostInstall: () => {
    return new Promise((resolve, reject) => {
      console.log("Setting up redux...");
      postinstall
        .setupPackage()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(chalk.red(err));
          reject(err);
        });
    });
  },
};
