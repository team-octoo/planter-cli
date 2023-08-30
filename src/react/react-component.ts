import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import inquirer from "inquirer";
import {DIRNAME} from "../globals";
import {files} from "../helpers/files";
import {PlanterConfigV1, PlanterConfigV2} from "../helpers/migrator";

export const reactComponents = {
  create: async name => {
    // const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
    const settings = files.readSettingsJson();

    const pascalCase = camelcase(name, {pascalCase: true});
    let casedName = camelcase(name, {pascalCase: true});
    if (settings.folderCasing === "lowercase") {
      casedName = name.toLowerCase();
    }
    // const lowerCase = name.toLowerCase();
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
        const folderArray = option.option.split("/");
        let folder = path.join.apply(null, folderArray.concat([casedName]));
        files.directoryExistsOrCreate(path.join(getDestPath(), folder));
        files.directoryExistsOrCreate(path.join(getDestPath(), folder, "tests"));
        createComponent(folder, pascalCase);
        createTests(folder, pascalCase);
        await createLayout(folder, pascalCase);
      })
      .then(() => {
        console.log(chalk.green("Component created..."));
      });
  },
};

async function createLayout(folder, name) {
  const settings = files.readSettingsJson();
  if (settings.layout.trim().toLowerCase() === "css") {
    await files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.css`));
  } else if (settings.layout.trim().toLowerCase() === "sass") {
    await files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.scss`));
  } else if (settings.layout.trim().toLowerCase() === "css-modules") {
    await files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.module.css`));
  } else if (settings.layout.trim().toLowerCase() === "sass-modules") {
    await files.fileExistsOrCreate(path.join(getDestPath(), folder, `${name}.module.scss`));
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
    if (settings.hasPropTypes) {
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
  const settings = files.readSettingsJson();
  return getChildFolders(settings.components).map(pathArray => path.join(...pathArray));
}

function getChildFolders(config: PlanterConfigV1["components"], basePath: string[] = []): string[][] {
  return Object.entries(config).flatMap(([element, value]) => {
    const path = [...basePath, element];

    if (typeof value === "string") return [path];

    return getChildFolders(value, path);
  });
}

function getSourcePath() {
  return path.resolve(DIRNAME, "react", "examples", "component");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
