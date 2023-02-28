import {files} from "../helpers/files.mjs";
import camelcase from "camelcase";
import path from "path";
import fs from "fs";
import os from "os";
import chalk from "chalk";
import {detect} from "../helpers/detect.mjs";
import {DIRNAME} from "../helpers/globals/globals.js";
import inquirer from "inquirer";
import {getRNFolders} from "./react-native-component.mjs";

export const form = {
  create: async name => {
    return detect
      .package("react-hook-form")
      .then(() => {
        return detect.package("@hookform/resolvers");
      })
      .then(() => {
        return detect.package("yup");
      })
      .then(() => {
        return inquirer.prompt([
          {
            type: "list",
            name: "option",
            message: "Choose where the component should be located:",
            choices: getRNFolders(),
          },
        ]);
      })
      .then(async option => {
        let nameWithFormEnd = name;
        if (!name.toLowerCase().endsWith("form")) {
          nameWithFormEnd = nameWithFormEnd + " form";
        }
        const pascalCase = camelcase(nameWithFormEnd, {pascalCase: true});
        const settings = files.readSettingsJson();
        let casedName = camelcase(nameWithFormEnd, {pascalCase: true});
        if (settings.folderCasing === "lowercase") {
          casedName = casedName.toLowerCase();
        }
        let folder = path.join(option.option, "forms", casedName);
        await files.directoryExistsOrCreate(path.join(getRNDestPath(), folder)),
          await files.directoryExistsOrCreate(path.join(getRNDestPath(), folder, "tests")),
          createRNForm(folder, pascalCase);
        createRNTests(folder, pascalCase);
        await createRNLayout(folder, pascalCase);
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};

export async function createRNLayout(folder, name) {
  let createdPath = files.copyFolder(
    path.resolve(getRNSourcePath(), "css", "Example.style.js"),
    path.join(getRNDestPath(), folder, `${name}.style.js`)
  );
}

export function createRNTests(folder, name) {
  let createdPath = files.copyFolder(
    path.resolve(getRNSourcePath(), "tests", "Example.test.js"),
    path.join(getRNDestPath(), folder, "tests", `${name}.test.js`)
  );
  files.replaceInFiles(createdPath, "Example", name);
}

export function createRNForm(folder, name) {
  const settings = files.readSettingsJson();
  let createdPath = undefined;
  if (settings.hasTs) {
    createdPath = files.copyFolder(
      path.resolve(getRNSourcePath(), "ts", "Example.tsx"),
      path.join(getRNDestPath(), folder, `${name}.tsx`)
    );
  } else {
    if (settings.hasPropTypes) {
      // if proptypes is used... add prop types
      createdPath = files.copyFolder(
        path.resolve(getRNSourcePath(), "js", "proptypes", "Example.js"),
        path.join(getRNDestPath(), folder, `${name}.js`)
      );
    } else {
      createdPath = files.copyFolder(
        path.resolve(getRNSourcePath(), "js", "Example.js"),
        path.join(getRNDestPath(), folder, `${name}.js`)
      );
    }
  }
  files.replaceInFiles(createdPath, "Example", name);
}

export function getRNSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "form");
}

export function getRNDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
