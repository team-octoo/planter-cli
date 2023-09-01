import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import inquirer from "inquirer";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";

export const reactComponents = {
  create: async name => {
    const settings = files.readSettingsJson();

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

        function getFileConfig(
          name: string,
          pathConfig: string
        ): {
          folderPath: string;
          fileName: string;
        } {
          const caseOptions = {
            "@camelCase": camelcase(name, {pascalCase: false}),
            "@pascalCase": camelcase(name, {pascalCase: true}),
          };

          const folderPath = Object.entries(caseOptions).reduce(
            (folderPath, [replacer, value]) => folderPath.replace(replacer, value),
            pathConfig
          );

          return {
            fileName: camelcase(name, {pascalCase: false}),
            folderPath,
          };
        }

        const componentLocations = settings.components[option.option];

        for (const [fileType, pathConfig] of Object.entries(componentLocations)) {
          const fileConfig = getFileConfig(name, pathConfig);
          files.directoryExistsOrCreate(path.join(process.cwd(), fileConfig.folderPath));
          createFileForComponent(fileType, fileConfig.folderPath, fileConfig.fileName);
        }
      })
      .then(() => console.log(chalk.green("Component created...")));
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
    createdPath = path.join(getDestPath(), folder, `${name}.test.tsx`);
    files.copyFile(path.resolve(getSourcePath(), "tests", "Example.test.tsx"), createdPath);
  } else {
    createdPath = path.join(getDestPath(), folder, `${name}.test.js`);
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
  return Object.keys(files.readSettingsJson().components);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "component");
}

function getDestPath() {
  return path.resolve(process.cwd());
}
