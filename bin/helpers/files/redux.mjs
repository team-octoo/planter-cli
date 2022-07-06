import chalk from "chalk";
import fs from "fs";
import { files } from "../files.mjs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { detect } from "../detect.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function replaceInFiles(filePath, searchValue, replaceValue) {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent = fileContent.replace(searchValue, replaceValue);
  fs.writeFileSync(filePath, fileContent);
  return true;
}
export const redux = {
  setupPackage: () => {
    return new Promise(async (resolve, reject) => {
      let packageName = await detect.packageName();
      let filePath = "";
      if (files.fileExists(path.join(process.cwd(), "src", "state", "store", "Store.js"))) {
        filePath = path.join(process.cwd(), "src", "state", "store", "Store.js");
      }
      if (files.fileExists(path.join(process.cwd(), "src", "state", "store", "Store.ts"))) {
        filePath = path.join(process.cwd(), "src", "state", "store", "Store.ts");
      }

      if (files.fileExists(filePath)) {
        replaceInFiles(filePath, "{APPNAME}", packageName);
      } else {
        reject("Could not find Store(.js/.ts) file...");
      }
      resolve("redux setup completed");
    });
  },

  copyFiles: () => {
    const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
    console.log("Creating redux files...");

    if (
      !files.fileExists(path.join(process.cwd(), "src", "state", "store", "Store.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "state", "store", "Store.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(
          __dirname,
          "..",
          "..",
          settings.library === "react" ? "react" : "reactnative",
          "examples",
          "state",
          "redux",
          "store",
          "Store.js"
        ),
        path.join(process.cwd(), "src", "state", "store", "Store.js")
      );
      if (settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "state", "store", "Store.js"),
          path.join(process.cwd(), "src", "state", "store", "Store.ts")
        );
      }
    }

    if (
      !files.fileExists(path.join(process.cwd(), "src", "state", "store", "Migrations.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "state", "store", "Migrations.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(
          __dirname,
          "..",
          "..",
          settings.library === "react" ? "react" : "reactnative",
          "examples",
          "state",
          "redux",
          "store",
          "Migrations.js"
        ),
        path.join(process.cwd(), "src", "state", "store", "Migrations.js")
      );
      if (settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "state", "store", "Migrations.js"),
          path.join(process.cwd(), "src", "state", "store", "Migrations.ts")
        );
      }
    }

    if (
      !files.fileExists(path.join(process.cwd(), "src", "state", "reducers", "RootReducer.js")) &&
      !files.fileExists(path.join(process.cwd(), "src", "state", "reducers", "RootReducer.ts"))
    ) {
      fs.copyFileSync(
        path.resolve(
          __dirname,
          "..",
          "..",
          settings.library === "react" ? "react" : "reactnative",
          "examples",
          "state",
          "redux",
          "reducers",
          "RootReducer.js"
        ),
        path.join(process.cwd(), "src", "state", "reducers", "RootReducer.js")
      );
      if (settings.hasTs) {
        fs.renameSync(
          path.join(process.cwd(), "src", "state", "reducers", "RootReducer.js"),
          path.join(process.cwd(), "src", "state", "reducers", "RootReducer.ts")
        );
      }
    }

    console.log(chalk.yellow("Created redux files."));
    return "ok";
  },
};
