import fs from "fs";
import path from "path";
import {DIRNAME} from "../globals";
import {PlanterConfigV2} from "./migrator";

export const files = {
  readJson: filePath => {
    const buffer = fs.readFileSync(path.join(process.cwd(), filePath));
    return JSON.parse(buffer.toString());
  },

  readPlanterPackageJson: () => {
    const filePath = path.join(DIRNAME, "..", "package.json");
    return JSON.parse(fs.readFileSync(filePath).toString());
  },

  readProjectPackageJson: () => files.readJson("package.json"),

  readSettingsJson: () => files.readJson("planter.config.json") as PlanterConfigV2,

  copyFile: (src, dest) => {
    const folderPath = path.dirname(dest);
    files.directoryExistsOrCreate(folderPath);

    fs.copyFileSync(src, dest);
  },

  replaceInFiles: (filePath, searchValue, replaceValue) => {
    const fileContent = fs.readFileSync(filePath).toString().replaceAll(searchValue, replaceValue);
    fs.writeFileSync(filePath, fileContent);
  },

  directoryExistsOrCreate: folderPath => {
    if (!files.directoryExists(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }
  },

  directoryExists: filePath => fs.existsSync(filePath),

  fileExists: filePath => fs.existsSync(filePath),

  fileExistsOrCreate: filePath => {
    const folderPath = path.dirname(filePath);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(folderPath, {recursive: true});
      fs.writeFileSync(filePath, "");
    }
  },

  overwriteFile: (filePath, content) => {
    const folderPath = path.dirname(filePath);
    fs.mkdirSync(folderPath, {recursive: true});
    fs.writeFileSync(filePath, content);
  },
};
