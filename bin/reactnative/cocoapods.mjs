import chalk from "chalk";
import { execSync } from "child_process";

export const cocoapods = {
  install: () => {
    return new Promise((resolve, reject) => {
      console.log(
        chalk.green("Installing required cocoapods...")
      );

      execSync("cd ios && pod install", { stdio: [0, 1, 2] });
      resolve("cocoapods Installed....")
    });
  }
}
