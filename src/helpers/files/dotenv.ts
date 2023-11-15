import fs from "fs";
import os from "os";
import path from "path";
import {files} from "../files";
import chalk from "chalk";
import {DIRNAME} from "../../globals";

export const dotenv = {
  copyFiles: () => {
    console.log("Creating .env files...");
    if (!files.fileExists(path.join(process.cwd(), ".env"))) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "reactnative", "examples", "dotenv", "example.env"),
        path.join(path.join(process.cwd(), ".env"))
      );
    }

    console.log(chalk.yellow("Created .env file."));
    return "ok";
  },
};
