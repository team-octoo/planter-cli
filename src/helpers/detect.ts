import chalk from "chalk";
import path from "path";
import {files} from "./files";

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
      resolve(false);
    });
  },
  library: async (): Promise<"react" | "react-native" | "install"> => {
    try {
      const {dependencies} = files.readProjectPackageJson();

      if (dependencies["react-native"]) {
        return "react-native";
      }
      if (dependencies["react"]) {
        return "react";
      }
    } catch (err) {
      return "install";
    }

    // throw new Error("No React or React-native library detected...");
  },
  typescript: async () => {
    return new Promise(resolve => {
      const {dependencies, devDependencies} = files.readProjectPackageJson();
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
      const {name} = files.readProjectPackageJson();
      resolve(name);
    });
  },
  package: async name => {
    return new Promise((resolve, reject) => {
      const {devDependencies, dependencies} = files.readProjectPackageJson();

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
