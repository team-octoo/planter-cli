import chalk from "chalk";
import {files} from "./files.mjs";
import path from "path";

export const detect = {
  config: async (force = false) => {
    return new Promise((resolve, reject) => {
      const fileExists = files.directoryExists(path.join(process.cwd(), "planter.config.json"));
      if (fileExists && force) {
        console.log(chalk.yellow("Using force... I hope you know what your doing."));
        resolve(true);
      } else if (!fileExists) {
        resolve(true);
      }

      reject("Planter config file detected... use --force option.");
    });
  },
  library: async () => {
    return new Promise((resolve, reject) => {
      const {dependencies} = files.readPackageJson();
      if (dependencies["react-native"]) {
        resolve("react-native");
      }
      if (dependencies.react) {
        resolve("react");
      }

      reject("No React or React-native library detected...");
    });
  },
  typescript: async () => {
    return new Promise(resolve => {
      const {dependencies, devDependencies} = files.readPackageJson();
      if (dependencies) {
        if (dependencies.typescript) {
          resolve(true);
        }
      }
      if (devDependencies) {
        if (devDependencies.typescript) {
          resolve(true);
        }
      }

      resolve(false);
    });
  },
  installer: async () => {
    return new Promise(resolve => {
      if (files.fileExists(path.join(process.cwd(), "package-lock.json"))) {
        resolve("npm");
      }
      if (files.fileExists(path.join(process.cwd(), "yarn.lock"))) {
        resolve("yarn");
      }
      resolve("unknown");
    });
  },
  packageName: async () => {
    return new Promise((resolve, reject) => {
      const {name} = files.readPackageJson();
      resolve(name);
    });
  },
  package: async name => {
    return new Promise((resolve, reject) => {
      const {devDependencies, dependencies} = files.readPackageJson();

      if (dependencies[name]) {
        resolve(true);
      }
      if (devDependencies[name]) {
        resolve(true);
      }
      reject(`Package ${name} not found...`);
    });
  },
};
