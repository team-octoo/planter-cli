import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";
import {files} from "../files";
import {DIRNAME} from "../../globals";
import {execSync} from "child_process";

function replaceTailwindConfigContent(filePath) {
  const settings = files.readSettingsJson();

  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent = fileContent.replace(
    "content: [],",
    "content: [" + os.EOL + '    "./index.html",' + os.EOL + '    "./src/**/*.{js,ts,jsx,tsx}",' + os.EOL + "  ],"
  );

  fs.writeFileSync(filePath, fileContent);
  return true;
}

function replaceIndexCssContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent =
    "@tailwind base;" +
    os.EOL +
    "@tailwind components;" +
    os.EOL +
    "@tailwind utilities;" +
    os.EOL +
    os.EOL +
    fileContent;
  fs.writeFileSync(filePath, fileContent);
  return true;
}

export const tailwind = {
  // setup steps for package
  setup: () => {
    return new Promise((resolve, reject) => {
      execSync("npx tailwindcss init -p");

      let configFilePath = path.join(process.cwd(), "tailwind.config.js");
      if (files.fileExists(configFilePath)) {
        replaceTailwindConfigContent(configFilePath);
      } else {
        console.log(chalk.red("********************************************************************"));
        console.log(
          chalk.red(
            "Could not find the tailwind config file. You will have to run the installation manually (https://tailwindcss.com/docs/guides/vite)."
          )
        );
        console.log(chalk.red("********************************************************************"));
        resolve(`Could not find src/${configFilePath} file...`);
      }

      const indexFilePath = path.join(process.cwd(), "src", "index.css");
      if (files.fileExists(indexFilePath)) {
        replaceIndexCssContent(indexFilePath);
      } else {
        console.log(chalk.red("********************************************************************"));
        console.log(
          chalk.red(
            "Could not find index.css file. You will have to set up tailwind manually (https://tailwindcss.com/docs/guides/vite)."
          )
        );
        console.log(chalk.red("********************************************************************"));
        resolve(`Could not find src/index.css file...`);
      }

      resolve("Tailwind setup completed");
    });
  },
};
