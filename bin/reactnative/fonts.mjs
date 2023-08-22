import chalk from "chalk";
import {files} from "../helpers/files.mjs";
import path from "path";
import {DIRNAME} from "../helpers/globals/globals.mjs";

export const fonts = {
  install: () => {
    return new Promise((resolve, reject) => {
      console.log(chalk.bgYellow("Copying fonts config file..."));

      files.copyFolder(
        path.join(DIRNAME, "..", "..", "reactnative", "examples", "config", "react-native.config.js"),
        path.join(process.cwd(), "react-native.config.js")
      );
      resolve("Fonts config file copied!");
    });
  },
};
