import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import {files} from "../helpers/files";
import inquirer from "inquirer";
import {DIRNAME} from "../globals";
import {PlanterConfigV3} from "../helpers/migrator";
import {assertNever} from "../helpers/assert-never";

export type FileType = keyof PlanterConfigV3["components"][string];

export const reactNativeComponents = {
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
      .then(() => {
        console.log(chalk.green("Component created..."));
      });
  },
};

export function createFileForComponent(fileType: FileType, pathConfig: string, name: string, form: boolean = false) {
  if (fileType === "component") return createComponent(getFilePath(fileType, pathConfig, name), name, form);
  if (fileType === "style") return createLayout(getFilePath(fileType, pathConfig, name), name);
  if (fileType === "test") return createTests(getFilePath(fileType, pathConfig, name), name, form);

  return assertNever(fileType);
}

export function getFilePath(fileType: FileType, pathConfig: string, name: string): string {
  const codeExtension = files.readSettingsJson().hasTs ? "tsx" : "js";

  if (fileType === "component") return applyReplacers(pathConfig, name, codeExtension);
  if (fileType === "style") return applyReplacers(pathConfig, name, "style.js");
  if (fileType === "test") return applyReplacers(pathConfig, name, codeExtension);

  return assertNever(fileType);
}

export function applyReplacers(pathConfig: string, name: string, extension: string): string {
  const caseOptions = {
    "@camelCase": camelcase(name, {pascalCase: false}),
    "@pascalCase": camelcase(name, {pascalCase: true}),
  };

  const pathReplaced = Object.entries(caseOptions)
    .reduce((folderPath, [replacer, value]) => folderPath.replaceAll(replacer, value), pathConfig)
    .replaceAll("@ext", extension);
  return path.join(process.cwd(), pathReplaced);
}

export function getSourcePath(form: boolean = false) {
  return path.resolve(DIRNAME, "reactnative", "examples", form ? "form" : "component");
}

export function getComponentTypeOptions(): string[] {
  return Object.keys(files.readSettingsJson().components);
}

export function createComponent(filePath: string, name: string, form: boolean) {
  const settings = files.readSettingsJson();

  const examplePath: string = settings.hasTs
    ? path.resolve(getSourcePath(form), "ts", "Example.tsx")
    : settings.usePropTypes
    ? path.resolve(getSourcePath(form), "js", "proptypes", "Example.js")
    : path.resolve(getSourcePath(form), "js", "Example.js");

  files.copyFile(examplePath, filePath);

  files.replaceInFiles(filePath, "Example", name);
}

export function createLayout(filePath: string, name: string) {
  const examplePath = path.resolve(getSourcePath(), "css", "Example.style.js");
  files.copyFile(examplePath, filePath);
  files.replaceInFiles(filePath, "Example", name);
}

export function createTests(filePath: string, name: string, form: boolean) {
  const settings = files.readSettingsJson();
  const examplePath = settings.hasTs
    ? path.resolve(getSourcePath(form), "tests", "Example.test.tsx")
    : path.resolve(getSourcePath(form), "tests", "Example.test.js");

  files.copyFile(examplePath, filePath);

  files.replaceInFiles(filePath, "Example", name);
}
