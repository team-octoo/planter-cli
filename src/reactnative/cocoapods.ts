import chalk from "chalk";
import child_process from "child_process";
import {detect} from "../helpers/detect";

export const cocoapods = {
  install: () => {
    return new Promise((resolve, reject) => {
      if (process.platform === "win32") {
        resolve("Windows detected... Cocoapods not installed!");
      }
      console.log(chalk.bgYellow("Installing required cocoapods..."));
      child_process.execSync("cd ios && pod install", {stdio: [0, 1, 2]});
      resolve("Cocoapods Installed!");
    });
  },
};
