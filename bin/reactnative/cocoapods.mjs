import chalk from "chalk";
import child_process from "child_process";

export const cocoapods = {
  install: () => {
    return new Promise((resolve, reject) => {
      console.log(
        chalk.green("Installing required cocoapods...")
      );

      child_process.execSync("cd ios && pod install", { stdio: [0, 1, 2] });
      resolve("cocoapods Installed....")
    });
  }
}
