import chalk from "chalk";
import inquirer from "inquirer";
import {install} from "../helpers/install.mjs";
import fs from "fs";
import path from "path";
import {execSync} from "child_process";

let testBranches = "";
let productionBranch = "";

export const setup = {
  gitlab: async () => {
    console.log("start CI/CD Setup for gitlab");
    return askLocalCommitChecks()
      .then(() => {
        return askTestBranches();
      })
      .then(() => {
        return askProductionBranch();
      })
      .then(() => {
        return createGitlabFile();
      })
      .then(() => {
        console.log(chalk.green("Gitlab file created..."));
      });
  },
};

function askLocalCommitChecks() {
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: "Husky",
        message: "Would you like to use local commit checks using Husky?",
        default: true,
      },
    ])
    .then(result => {
      const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
      if (result.Husky) {
        let devpackages = ["husky"];
        if (settings.installer === "npm") {
          install.installNPM([], devpackages);
        } else if (settings.installer === "yarn") {
          install.installYarn([], devpackages);
        }
        execSync('npm pkg set scripts.prepare="husky install"', {stdio: [0, 1, 2]});
        execSync('npm pkg set scripts.prettier="prettier src --write"', {stdio: [0, 1, 2]});
        execSync('npm pkg set scripts.lint="eslint src --fix"', {stdio: [0, 1, 2]});
        execSync("npx husky install");
        execSync('npx husky add .husky/pre-commit "npm run prettier\n' + "npm run lint\n" + "\n" + 'git add ."');
        console.log(chalk.green("Husky setup done..."));
      } else {
        console.log(chalk.magenta("Skipping Husky setup"));
      }
      return Promise.resolve();
    });
}

function askTestBranches() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "Branches",
        message: "Which branches (comma separated) should we run tests on when merge requests are created to them?",
      },
    ])
    .then(result => {
      testBranches = result.Branches;
      return Promise.resolve();
    });
}

function askProductionBranch() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "Branch",
        message:
          "Planter creates a coverage file of the tests on your production branch.\nWhich branch is your prodcution branch?",
      },
    ])
    .then(result => {
      productionBranch = result.Branch;
      return Promise.resolve();
    });
}

function createGitlabFile() {
  console.log(chalk.cyanBright("Now starting on the creation of your gitlab file"));
  return Promise.resolve();
}
