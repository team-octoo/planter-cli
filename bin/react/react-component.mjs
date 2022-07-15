import fs from "fs";
import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import { DIRNAME } from "../helpers/globals/globals.js";
import { files } from "../helpers/files.mjs";
import inquirer from "inquirer";

export const reactComponents = {
  create: async (name) => {
    const pascalCase = camelcase(name, { pascalCase: true });
    const lowerCase = name.toLowerCase();
    return inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message: "Choose where the component should be located:",
          choices: getFolders(),
        },
      ])
      .then(async (option) => {
        let folder = path.join(option.option, lowerCase);
        await files.directoryExistsOrCreate(path.join(getDestPath(), folder)),
          await files.directoryExistsOrCreate(path.join(getDestPath(), folder, "tests")),
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
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
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
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  let createdPath = undefined;
  if (settings.hasTs) {
    createdPath = files.copyFolder(
      path.resolve(getSourcePath(), "tests", "Example.test.tsx"),
      path.join(getDestPath(), folder, "tests", `${name}.test.tsx`)
    );
  } else {
    createdPath = files.copyFolder(
      path.resolve(getSourcePath(), "tests", "Example.test.js"),
      path.join(getDestPath(), folder, "tests", `${name}.test.js`)
    );
  }
  files.replaceInFiles(createdPath, "Example", name);
}

function createComponent(folder, name) {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  let createdPath = undefined;
  if (settings.hasTs) {
    createdPath = files.copyFolder(
      path.resolve(getSourcePath(), "ts", "Example.tsx"),
      path.join(getDestPath(), folder, `${name}.tsx`)
    );
  } else {
    createdPath = files.copyFolder(
      path.resolve(getSourcePath(), "js", "Example.js"),
      path.join(getDestPath(), folder, `${name}.js`)
    );
  }
  files.replaceInFiles(createdPath, "Example", name);
}

function getFolders() {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  let folders = [];
  for (const [key, value] of Object.entries(settings.components)) {
    if (value.toLowerCase() === "folder") {
      folders.push(key);
    }
  }
  return folders;
}

function getSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "react", "examples", "component");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
