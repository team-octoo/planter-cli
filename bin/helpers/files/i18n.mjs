import fs from "fs";
import os from "os";
import path from "path";
import {files} from "../files.mjs";
import {DIRNAME} from "../globals/globals.js";

function replaceIndexContent(filePath) {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  if (settings.library === "react-native") {
    fileContent = fileContent.replace("'react-native';", "'react-native';" + os.EOL + "import './src/i18n';");
  } else {
    fileContent = fileContent.replace("'./reportWebVitals';", "'./reportWebVitals';" + os.EOL + "import './i18n';");
  }
  fs.writeFileSync(filePath, fileContent);
  return true;
}

function replacePackageContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent = fileContent.replace(
    '"scripts": {',
    '"scripts": {' +
      os.EOL +
      "    \"translate\": \"i18next 'src/**/*.js' 'src/components/**/*.js' 'src/**/*.ts' 'src/**/*.tsx'\","
  );
  fs.writeFileSync(filePath, fileContent);
  return true;
}

function copyFile(filename, destPath, subdir = false) {
  files.directoryExistsOrCreate(destPath);
  if (!files.fileExists(path.join(process.cwd(), filename))) {
    fs.copyFileSync(
      subdir
        ? path.resolve(DIRNAME, "..", "..", "react", "examples", "i18next", subdir, filename)
        : path.resolve(DIRNAME, "..", "..", "react", "examples", "i18next", filename),
      path.join(destPath, filename)
    );
  }
}

function copyFiles() {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

  copyFile("i18next-parser.config.js", path.join(process.cwd()));
  if (settings.library === "react-native") {
    copyFile(`i18n.js`, path.join(process.cwd(), "src"), "RN");
  } else {
    copyFile(`i18n.js`, path.join(process.cwd(), "src"));
  }

  copyFile("en.json", path.join(process.cwd(), "src", "locales"));
}

export const i18n = {
  // setup steps for package
  setup: () => {
    return new Promise((resolve, reject) => {
      const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
      copyFiles();

      let indexFilename = `index.${settings.hasTs ? "tsx" : "js"}`;
      let indexFilePath = path.join(process.cwd(), "src", indexFilename);
      if (settings.library === "react-native") {
        indexFilename = "index.js";
        indexFilePath = path.join(process.cwd(), indexFilename);
      }
      if (files.fileExists(indexFilePath)) {
        replaceIndexContent(indexFilePath);
      } else {
        reject(`Could not find src/${indexFilename} file...`);
      }

      const packageFilename = "package.json";
      const packageFilePath = path.join(process.cwd(), packageFilename);
      if (files.fileExists(packageFilePath)) {
        replacePackageContent(packageFilePath);
      } else {
        reject(`Could not find ${packageFilename} file...`);
      }

      resolve("i18next setup completed");
    });
  },
};
