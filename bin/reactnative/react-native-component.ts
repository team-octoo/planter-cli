import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import {DIRNAME} from "../helpers/globals/globals";
import {files} from "../helpers/files";
import inquirer from "inquirer";

export const reactNativeComponents = {
  create: async name => {
    const pascalCase = camelcase(name, {pascalCase: true});
    const settings = files.readSettingsJson();
    let casedName = camelcase(name, {pascalCase: true});
    if (settings.folderCasing === "lowercase") {
      casedName = name.toLowerCase();
    }

    return inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message: "Choose where the component should be located:",
          choices: getRNFolders(),
        },
      ])
      .then(async option => {
        let folder = path.join(option.option, casedName);
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

export async function createRNLayout(folder, name) {
  let createdPath = path.join(getRNDestPath(), folder, `${name}.style.js`);
  files.copyFile(path.resolve(getRNSourcePath(), "css", "Example.style.js"), createdPath);
}

export function createRNTests(folder, name) {
  let createdPath = path.join(getRNDestPath(), folder, "tests", `${name}.test.js`);
  files.copyFile(path.resolve(getRNSourcePath(), "tests", "Example.test.js"), createdPath);
  files.replaceInFiles(createdPath, "Example", name);
}

export function createRNComponent(folder, name) {
  const settings = files.readSettingsJson();
  let createdPath;
  if (settings.hasTs) {
    createdPath = path.join(getRNDestPath(), folder, `${name}.tsx`);
    files.copyFile(path.resolve(getRNSourcePath(), "ts", "Example.tsx"), createdPath);
  } else {
    if (settings.hasPropTypes) {
      // if proptypes is used... add prop types
      createdPath = path.join(getRNDestPath(), folder, `${name}.js`);
      files.copyFile(path.resolve(getRNSourcePath(), "js", "proptypes", "Example.js"), createdPath);
    } else {
      createdPath = path.join(getRNDestPath(), folder, `${name}.js`);
      files.copyFile(path.resolve(getRNSourcePath(), "js", "Example.js"), createdPath);
    }
  }
  files.replaceInFiles(createdPath, "Example", name);
}

export function getRNFolders() {
  try {
    const settings = files.readSettingsJson();
    let folders = [];

    folders = getRNChildFolders(settings.components);
    return folders;
  } catch (e) {
    return e;
  }
}

export function getRNChildFolders(parent, basePath = undefined) {
  let keys = Object.keys(parent);
  let paths = [];
  for (let index = 0; index < keys.length; index++) {
    const element = keys[index];
    if (typeof parent[element] === "string") {
      if (basePath) {
        paths.push(`${basePath}/${element}`);
      } else {
        paths.push(`${element}`);
      }
    } else {
      if (basePath) {
        paths.push(...getRNChildFolders(parent[element], `${basePath}/${element}`));
      } else {
        paths.push(...getRNChildFolders(parent[element], `${element}`));
      }
    }
  }
  return paths;
}

// Reduce version of getChildFolders
// function mapRNStructure (object, level = 1, basename = '') {
//   const entries = Object.entries(object);
//   return entries.reduce((acc, [dirName, content]) => {
//     const path = `${basename}${ basename && '/' }${dirName}`;
//     if (typeof content === 'string') {
//       return [...acc, path]
//     } else {
//       return [...acc, ...mapStructure(content, level++, path)]
//     }
//   }, [])
// }

export function getRNSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "component");
}

export function getRNDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
