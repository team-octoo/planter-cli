import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import inquirer from "inquirer";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";
import {assertNever} from "../helpers/assert-never";
import {LayoutType, PlanterConfigV3} from "../helpers/migrator";

type FileType = keyof PlanterConfigV3["components"][string];

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
        const componentLocations = settings.components[option.option];

        for (const [fileType, pathConfig] of Object.entries(componentLocations)) {
          createFileForComponent(fileType as FileType, pathConfig, camelcase(name, {pascalCase: true}));
        }
      })
      .then(() => console.log(chalk.green("Component created...")));
  },
};

function createComponent(filePath: string, name: string) {
  const settings = files.readSettingsJson();

  const examplePath: string = settings.hasTs
    ? path.resolve(getSourcePath(), "ts", "Example.tsx")
    : settings.usePropTypes
    ? path.resolve(getSourcePath(), "js", "proptypes", "Example.js")
    : path.resolve(getSourcePath(), "js", "Example.js");

  files.copyFile(examplePath, filePath);

  files.replaceInFiles(filePath, "Example", name);
}

function createLayout(filePath: string) {
  files.fileExistsOrCreate(filePath);
}

function createTests(filePath: string, name: string) {
  const settings = files.readSettingsJson();
  const examplePath = settings.hasTs
    ? path.resolve(getSourcePath(), "tests", "Example.test.tsx")
    : path.resolve(getSourcePath(), "tests", "Example.test.js");

  files.copyFile(examplePath, filePath);

  files.replaceInFiles(filePath, "Example", name);
}

function getComponentTypeOptions(): string[] {
  return Object.keys(files.readSettingsJson().components);
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "component");
}

function applyReplacers(pathConfig: string, name: string, extension: string): string {
  const caseOptions = {
    "@camelCase": camelcase(name, {pascalCase: false}),
    "@pascalCase": camelcase(name, {pascalCase: true}),
  };

  const pathReplaced = Object.entries(caseOptions)
    .reduce((folderPath, [replacer, value]) => folderPath.replaceAll(replacer, value), pathConfig)
    .replaceAll("@ext", extension);
  return path.join(process.cwd(), pathReplaced);
}

function createFileForComponent(fileType: FileType, pathConfig: string, name: string) {
  if (fileType === "component") return createComponent(getFilePath(fileType, pathConfig, name), name);
  if (fileType === "style") return createLayout(getFilePath(fileType, pathConfig, name));
  if (fileType === "test") return createTests(getFilePath(fileType, pathConfig, name), name);

  return assertNever(fileType);
}

function getFilePath(fileType: FileType, pathConfig: string, name: string): string {
  function getLayoutExtension(layoutType: LayoutType) {
    if (layoutType === "css") return "css";
    if (layoutType === "sass") return "scss";
    if (layoutType === "css-modules") return "module.css";
    if (layoutType === "sass-modules") return "module.scss";

    return assertNever(layoutType);
  }

  const codeExtension = files.readSettingsJson().hasTs ? "tsx" : "js";

  if (fileType === "component") return applyReplacers(pathConfig, name, codeExtension);
  if (fileType === "style")
    return applyReplacers(pathConfig, name, getLayoutExtension(files.readSettingsJson().layout));
  if (fileType === "test") return applyReplacers(pathConfig, name, "test." + codeExtension);

  return assertNever(fileType);
}
