import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";
import {files} from "../files.mjs";
import {DIRNAME} from "../globals/globals.mjs";

function replacePackageContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent = fileContent.replace(
    "import {name as appName} from './app.json';",
    "import {name as appName} from './app.json';" +
      os.EOL +
      os.EOL +
      "if (process.env.NODE_ENV === 'development') {" +
      os.EOL +
      "  const {makeServer} = require('./src/mocks/server');" +
      os.EOL +
      "  makeServer({environment: 'development'});" +
      os.EOL +
      "}"
  );
  fs.writeFileSync(filePath, fileContent);
  return true;
}
export const mirage = {
  // setup steps for package
  setupPackage: () => {
    //if .env.development or .env.production exists
    return new Promise((resolve, reject) => {
      replacePackageContent(path.join(process.cwd(), "index.js"));

      resolve("MirageJS setup completed");
    });
  },

  copyFiles: () => {
    console.log("Creating MirageJS files...");
    if (!files.fileExists(path.join(process.cwd(), "src", "mocks", "server.js"))) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "mirage", "mocks", "server.js"),
        path.join(process.cwd(), "src", "mocks", "server.js")
      );
    }

    if (!files.fileExists(path.join(process.cwd(), "jest.config.js"))) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "mirage", "jest.config.js"),
        path.join(process.cwd(), "jest.config.js")
      );
    }

    if (!files.fileExists(path.join(process.cwd(), "jest.setup.js"))) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "mirage", "jest.setup.js"),
        path.join(process.cwd(), "jest.setup.js")
      );
    }
    console.log(chalk.yellow("Created MirageJS files."));
    return "ok";
  },
};
