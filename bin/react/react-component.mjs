import path from "path";
import camelcase from "camelcase";
import chalk from "chalk";
import inquirer from "inquirer";
import {DIRNAME} from "../helpers/globals/globals.js";
import {files} from "../helpers/files.mjs";

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
          choices: getFolders(),
        },
      ])
      .then(async option => {
        const folderArray = option.option.split("/");
        let folder = path.join.apply(null, folderArray.concat([casedName]));
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
  const settings = files.readSettingsJson();
  let createdPath = undefined;
  if (settings.hasTs) {
    createdPath = files.copyFolder(
      path.resolve(getSourcePath(), "ts", "Example.tsx"),
      path.join(getDestPath(), folder, `${name}.tsx`)
    );
  } else {
    if (settings.hasPropTypes) {
      // if proptypes is used... add prop types
      createdPath = files.copyFolder(
        path.resolve(getSourcePath(), "js", "proptypes", "Example.js"),
        path.join(getDestPath(), folder, `${name}.js`)
      );
    } else {
      createdPath = files.copyFolder(
        path.resolve(getSourcePath(), "js", "Example.js"),
        path.join(getDestPath(), folder, `${name}.js`)
      );
    }
  }
  files.replaceInFiles(createdPath, "Example", name);
}

function getFolders() {
  const settings = files.readSettingsJson();
  let folders = [];

  folders = getChildFolders(settings.components);
  return folders;
}

function getChildFolders(parent, basePath = undefined) {
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
        paths.push(...getChildFolders(parent[element], `${basePath}/${element}`));
      } else {
        paths.push(...getChildFolders(parent[element], `${element}`));
      }
    }
  }
  return paths;
}

// Reduce version of getChildFolders
// function mapStructure (object, level = 1, basename = '') {
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

function getSourcePath() {
  return path.resolve(DIRNAME, "..", "..", "react", "examples", "component");
}

function getDestPath() {
  return path.resolve(process.cwd(), "src", "components");
}
