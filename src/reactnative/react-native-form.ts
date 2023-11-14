import {files} from "../helpers/files";
import camelcase from "camelcase";
import path from "path";
import fs from "fs";
import os from "os";
import chalk from "chalk";
import {detect} from "../helpers/detect";
import {DIRNAME} from "../globals";
import inquirer from "inquirer";
import {FileType, createFileForComponent, getComponentTypeOptions} from "./react-native-component";

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
            choices: getComponentTypeOptions(),
          },
        ]);
      })
      .then(async option => {
        let nameWithFormEnd = name;
        if (!name.toLowerCase().endsWith("form")) {
          nameWithFormEnd = nameWithFormEnd + " form";
        }
        const settings = files.readSettingsJson();

        const componentLocations = settings.components[option.option];

        for (const [fileType, pathConfig] of Object.entries(componentLocations)) {
          createFileForComponent(
            fileType as FileType,
            pathConfig,
            camelcase(nameWithFormEnd, {pascalCase: true}),
            true
          );
        }
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  },
};

// export async function createRNLayout(folder, name) {
//   let createdPath = path.join(getRNDestPath(), folder, `${name}.style.js`);
//   files.copyFile(path.resolve(getRNSourcePath(), "css", "Example.style.js"), createdPath);
// }

// export function createRNTests(folder, name) {
//   let createdPath = path.join(getRNDestPath(), folder, "tests", `${name}.test.js`);
//   files.copyFile(path.resolve(getRNSourcePath(), "tests", "Example.test.js"), createdPath);
//   files.replaceInFiles(createdPath, "Example", name);
// }

// export function createRNForm(folder, name) {
//   const settings = files.readSettingsJson();
//   let createdPath;
//   if (settings.hasTs) {
//     createdPath = path.join(getRNDestPath(), folder, `${name}.tsx`);
//     files.copyFile(path.resolve(getRNSourcePath(), "ts", "Example.tsx"), createdPath);
//   } else {
//     if (settings.usePropTypes) {
//       // if proptypes is used... add prop types
//       createdPath = path.join(getRNDestPath(), folder, `${name}.js`);
//       files.copyFile(path.resolve(getRNSourcePath(), "js", "proptypes", "Example.js"), createdPath);
//     } else {
//       createdPath = path.join(getRNDestPath(), folder, `${name}.js`);
//       files.copyFile(path.resolve(getRNSourcePath(), "js", "Example.js"), createdPath);
//     }
//   }
//   files.replaceInFiles(createdPath, "Example", name);
// }

// export function getRNSourcePath() {
//   return path.resolve(DIRNAME, "reactnative", "examples", "form");
// }

// export function getRNDestPath() {
//   return path.resolve(process.cwd(), "src", "components");
// }

// export function getRNFolders() {
//   try {
//     const settings = files.readSettingsJson();
//     let folders = [];

//     folders = getRNChildFolders(settings.components);
//     return folders;
//   } catch (e) {
//     return e;
//   }
// }

// export function getRNChildFolders(parent, basePath = undefined) {
//   let keys = Object.keys(parent);
//   let paths = [];
//   for (let index = 0; index < keys.length; index++) {
//     const element = keys[index];
//     if (typeof parent[element] === "string") {
//       if (basePath) {
//         paths.push(`${basePath}/${element}`);
//       } else {
//         paths.push(`${element}`);
//       }
//     } else {
//       if (basePath) {
//         paths.push(...getRNChildFolders(parent[element], `${basePath}/${element}`));
//       } else {
//         paths.push(...getRNChildFolders(parent[element], `${element}`));
//       }
//     }
//   }
//   return paths;
// }
