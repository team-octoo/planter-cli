import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";

function replacePackageContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent = fileContent.replace(
    '"scripts": {',
    '"scripts": {' + os.EOL + '    "postinstall": "patch-package",' + os.EOL
  );
  fs.writeFileSync(filePath, fileContent);
  return true;
}
export const postinstall = {
  // setup steps for package
  setupPackage: () => {
    //if .env.development or .env.production exists
    return new Promise((resolve, reject) => {
      replacePackageContent(path.join(process.cwd(), "package.json"));

      resolve("postinstall setup completed");
    });
  },
};
