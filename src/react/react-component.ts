import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import inquirer from "inquirer";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";

export const reactComponents = {
  create: async name => {
    const settings = files.readSettingsJson();
    const pascalCase = camelcase(name, {pascalCase: true});
    let casedName = camelcase(name, {pascalCase: true});

    return inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message: "Choose where the component should be located:",
          choices: getComponentTypeOptions(),
        },
      ])
      .then(async option => {
        function createFileForComponent(fileType: string, path: string, fileName: string) {
          if (fileType === "component") return createComponent(path, fileName);
          if (fileType === "style") return createLayout(path, fileName);
          if (fileType === "test") return createTests(path, fileName);
        }

        const componentLocations = settings.components[option.option];

        for (const [fileType, partialPath] of Object.entries(componentLocations)) {
          const folderPath = path.join(process.cwd(), partialPath);
          files.directoryExistsOrCreate(folderPath);

          createFileForComponent(fileType, folderPath, casedName);
        }
      })
      .then(() => {
        console.log(chalk.green("Component created..."));
      });
  },
};

function createLayout(folder, name) {
  const settings = files.readSettingsJson();
  if (settings.layout.trim().toLowerCase() === "css") {
    files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.css`));
  } else if (settings.layout.trim().toLowerCase() === "sass") {
    files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.scss`));
  } else if (settings.layout.trim().toLowerCase() === "css-modules") {
    files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.module.css`));
  } else if (settings.layout.trim().toLowerCase() === "sass-modules") {
    files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.module.scss`));
  }
}

function createTests(folder, name) {
  const settings = files.readSettingsJson();
  let createdPath;
  if (settings.hasTs) {
    createdPath = path.join(getDestPath(), folder, "tests", `${name}.test.tsx`);
    files.copyFile(path.resolve(getSourcePath(), "tests", "Example.test.tsx"), createdPath);
  } else {
    createdPath = path.join(getDestPath(), folder, "tests", `${name}.test.js`);
    files.copyFile(path.resolve(getSourcePath(), "tests", "Example.test.js"), createdPath);
  }
  files.replaceInFiles(createdPath, "Example", name);
}

function createComponent(folder, name) {
  const settings = files.readSettingsJson();
  let createdPath;
  if (settings.hasTs) {
    createdPath = path.join(getDestPath(), folder, `${name}.tsx`);
    files.copyFile(path.resolve(getSourcePath(), "ts", "Example.tsx"), createdPath);
  } else {
    if (settings.usePropTypes) {
      // if proptypes is used... add prop types
      createdPath = path.join(getDestPath(), folder, `${name}.js`);
      files.copyFile(path.resolve(getSourcePath(), "js", "proptypes", "Example.js"), createdPath);
    } else {
      createdPath = path.join(getDestPath(), folder, `${name}.js`);
      files.copyFile(path.resolve(getSourcePath(), "js", "Example.js"), createdPath);
    }
  }
  files.replaceInFiles(createdPath, "Example", name);
}

function getComponentTypeOptions(): string[] {
  return Object.keys(files.readSettingsJson());
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "component");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
