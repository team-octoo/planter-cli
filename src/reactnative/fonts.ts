import chalk from "chalk";
import {files} from "../helpers/files";
import path from "path";
import {DIRNAME} from "../globals";

export const fonts = {
  install: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Copying fonts config file..."));

      files.copyFile(
        path.join(DIRNAME, "reactnative", "examples", "config", "react-native.config.js"),
        path.join(process.cwd(), "react-native.config.js")
      );
      resolve("Fonts config file copied!");
    });
  },
};
