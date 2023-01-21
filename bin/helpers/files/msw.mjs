import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";
import {files} from "../files.mjs";
import {DIRNAME} from "../globals/globals.js";

function replaceIndexContent(filePath) {
  const settings = files.readSettingsJson();

  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  if (!settings.hasTs) {
    fileContent = fileContent.replace(
      "'./reportWebVitals';",
      "'./reportWebVitals';" +
        os.EOL +
        'if (process.env.REACT_APP_MOCK_API === "1") {' +
        os.EOL +
        '  const { worker } = require("./mocks/browser.js");' +
        os.EOL +
        "  worker.start({" +
        os.EOL +
        '    onUnhandledRequest: "bypass",' +
        os.EOL +
        "  });" +
        os.EOL +
        "}"
    );
  } else {
    fileContent = fileContent.replace(
      "'./reportWebVitals';",
      "'./reportWebVitals';" +
        os.EOL +
        'if (process.env.REACT_APP_MOCK_API === "1") {' +
        os.EOL +
        '  const { worker } = require("./mocks/browser.ts");' +
        os.EOL +
        "  worker.start({" +
        os.EOL +
        '    onUnhandledRequest: "bypass",' +
        os.EOL +
        "  });" +
        os.EOL +
        "}"
    );
  }

  fs.writeFileSync(filePath, fileContent);
  return true;
}
export const msw = {
  // setup steps for package
  setupPackage: () => {
    //if .env.development or .env.production exists
    return new Promise((resolve, reject) => {
      files.fileExistsOrCreate(path.join(process.cwd(), ".env.development"));
      fs.appendFileSync(path.join(process.cwd(), ".env.development"), "REACT_APP_MOCK_API=1", function (err) {
        if (err) reject(err);
      });
      files.fileExistsOrCreate(path.join(process.cwd(), ".env.test"));
      fs.appendFileSync(path.join(process.cwd(), ".env.test"), "REACT_APP_MOCK_API=1", function (err) {
        if (err) reject(err);
      });
      files.fileExistsOrCreate(path.join(process.cwd(), ".env.production"));
      fs.appendFileSync(path.join(process.cwd(), ".env.production"), "REACT_APP_MOCK_API=0", function (err) {
        if (err) reject(err);
      });

      const settings = files.readSettingsJson();
      if (settings.hasTs) {
        const filePath = path.join(process.cwd(), "src", "index.tsx");
        if (files.fileExists(filePath)) {
          replaceIndexContent(filePath);
        } else {
          console.log(chalk.red("********************************************************************"));
          console.log(chalk.red("Could not find index.tsx file. You will have to set up msw manually."));
          console.log(chalk.red("********************************************************************"));
          resolve("msw installed but not setup");
        }
      } else {
        const filePath = path.join(process.cwd(), "src", "index.js");
        if (files.fileExists(filePath)) {
          replaceIndexContent(filePath);
        } else {
          console.log(chalk.red("********************************************************************"));
          console.log(chalk.red("Could not find index.js file. You will have to set up msw manually."));
          console.log(chalk.red("********************************************************************"));
          resolve("msw installed but not setup");
        }
      }
      resolve("msw setup completed");
    });
  },

  copyFiles: () => {
    const settings = files.readSettingsJson();
    console.log("Creating mock service worker files...");
    if (
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "handlers.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "handlers.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "react", "examples", "msw", "handlers.ts"),
        path.join(process.cwd(), "src", "mocks", "handlers.ts")
      );
      if (!settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "mocks", "handlers.ts"),
          path.join(process.cwd(), "src", "mocks", "handlers.js")
        );
      }
    }

    if (
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "browser.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "browser.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "react", "examples", "msw", "browser.ts"),
        path.join(process.cwd(), "src", "mocks", "browser.ts")
      );
      if (!settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "mocks", "browser.ts"),
          path.join(process.cwd(), "src", "mocks", "browser.js")
        );
      }
    }

    if (
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "mockDatabase.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "mockDatabase.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "react", "examples", "msw", "mockDatabase.ts"),
        path.join(process.cwd(), "src", "mocks", "mockDatabase.ts")
      );
      if (!settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "mocks", "mockDatabase.ts"),
          path.join(process.cwd(), "src", "mocks", "mockDatabase.js")
        );
      }
    }

    if (
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "server.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "mocks", "server.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "..", "..", "react", "examples", "msw", "server.ts"),
        path.join(process.cwd(), "src", "mocks", "server.ts")
      );
      if (!settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "mocks", "server.ts"),
          path.join(process.cwd(), "src", "mocks", "server.js")
        );
      }
    }
    console.log(chalk.yellow("Created msw files."));
    return "ok";
  },
};
