import fs from "fs";
import path from "path";

export const files = {
  readFileSync: filePath => {
    const buffer = fs.readFileSync(path.join(process.cwd(), filePath));
    const fileJson = JSON.parse(buffer.toString());
    return fileJson;
  },
  readPackageJson: () => {
    return files.readFileSync("package.json");
  },
  readSettingsJson: () => {
    return files.readFileSync("planter.config.json");
  },
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },
  copyFolder: (src, dest) => {
    fs.copyFileSync(src, dest);
    return dest;
  },
  replaceInFiles: (filePath, searchValue, replaceValue) => {
    const buffer = fs.readFileSync(filePath);
    let fileContent = buffer.toString();
    fileContent = fileContent.replaceAll(searchValue, replaceValue);
    fs.writeFileSync(filePath, fileContent);
    return true;
  },
  directoryExistsOrCreate: folderPath => {
    return new Promise((resolve, reject) => {
      if (!files.directoryExists(folderPath)) {
        fs.mkdirSync(folderPath, {recursive: true}, err => {
          if (err) reject(err);
        });
      }
      resolve();
    });
  },
  directoryExists: filePath => {
    return fs.existsSync(filePath);
  },
  fileExists: filePath => {
    return fs.existsSync(filePath);
  },
  fileExistsOrCreate: filePath => {
    const folderPath = path.dirname(filePath);
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(folderPath, {recursive: true}, err => {
          if (err) reject(err);
        });
        fs.writeFileSync(filePath, "");
      }
      resolve();
    });
  },
  overwriteFile: (filePath, content) => {
    const folderPath = path.dirname(filePath);
    return new Promise((resolve, reject) => {
      fs.mkdirSync(folderPath, {recursive: true}, err => {
        if (err) reject(err);
      });
      fs.writeFileSync(filePath, content);
      resolve();
    });
  },
};
