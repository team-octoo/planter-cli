import fs from "fs";
import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import { DIRNAME } from "../helpers/globals/globals.js";
import { files } from "../helpers/files.mjs";
import inquirer from "inquirer";

export const reactNativeComponents = {
  create: async (name) => {
    const pascalCase = camelcase(name, { pascalCase: true });
    const lowerCase = name.toLowerCase();

    console.log(getRNSourcePath());
    return inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message: "Choose where the component should be located:",
          choices: getRNFolders(),
        },
      ])
      .then(async (option) => {
        let folder = path.join(option.option, lowerCase);
        await files.directoryExistsOrCreate(path.join(getRNDestPath(), folder)),
          await files.directoryExistsOrCreate(path.join(getRNDestPath(), folder, "tests")),
          createRNComponent(folder, pascalCase);
        createRNTests(folder, pascalCase);
        await createRNLayout(folder, pascalCase);
      })
      .then(() => {
        console.log(chalk.green("Component created..."));
      });
  },
};

async function createRNLayout(folder, name) {
  let createdPath = files.copyFolder(
    path.resolve(getRNSourcePath(), "css", "Example.style.js"),
    path.join(getRNDestPath(), folder, `${name}.style.js`)
  );
}

function createRNTests(folder, name) {
  let createdPath = files.copyFolder(
    path.resolve(getRNSourcePath(), "tests", "Example.test.js"),
    path.join(getRNDestPath(), folder, "tests", `${name}.test.js`)
  );
  files.replaceInFiles(createdPath, "Example", name);
}

function createRNComponent(folder, name) {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  let createdPath = undefined;
  if (settings.hasTs) {
    createdPath = files.copyFolder(
      path.resolve(getRNSourcePath(), "ts", "Example.tsx"),
      path.join(getRNDestPath(), folder, `${name}.tsx`)
    );
  } else {
    createdPath = files.copyFolder(
      path.resolve(getRNSourcePath(), "js", "Example.js"),
      path.join(getRNDestPath(), folder, `${name}.js`)
    );
  }
  files.replaceInFiles(createdPath, "Example", name);
}

function getRNFolders() {
  const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
  let folders = [];
  for (const [key, value] of Object.entries(settings.components)) {
    if (value.toLowerCase() === "folder") {
      folders.push(key);
    }
  }
  return folders;
}

function getRNSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "component");
}

function getRNDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
