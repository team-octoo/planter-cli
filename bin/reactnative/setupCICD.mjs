import chalk from "chalk";
import inquirer from "inquirer";
import {install} from "../helpers/install.mjs";
import fs from "fs";
import os from "os";
import path from "path";
import {execSync} from "child_process";
import {files} from "../helpers/files.mjs";
import {DIRNAME} from "../helpers/globals/globals.js";

let testBranchesGitlab = "";
let productionBranchGitlab = "";

let testBranches = [];
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
        return askTestTreshold();
      })
      .then(() => {
        if (testBranchesGitlab || productionBranchGitlab) {
          return createGitlabFile();
        }
        return Promise.resolve([]);
      })
      .then(filesCreated => {
        if (filesCreated.length > 0) {
          console.log(chalk.cyanBright("Gitlab files created..."));
          filesCreated.map(x => {
            console.log(chalk.green(x));
          });
        }
      });
  },

  github: async () => {
    console.log("start CI/CD Setup for github");
    return askLocalCommitChecks()
      .then(() => {
        return askTestBranches();
      })
      .then(() => {
        return askProductionBranch();
      })
      .then(() => {
        return askTestTreshold();
      })
      .then(() => {
        if (testBranches || productionBranch) {
          return createGithubFile();
        }
        return Promise.resolve([]);
      })
      .then(filesCreated => {
        if (filesCreated.length > 0) {
          console.log(chalk.cyanBright("Github files created..."));
          filesCreated.map(x => {
            console.log(chalk.green(x));
          });
        }
      });
  },

  bitbucket: async () => {
    console.log("start CI/CD Setup for bitbucket");
    return askLocalCommitChecks()
      .then(() => {
        return askProductionBranch();
      })
      .then(() => {
        return askTestTreshold();
      })
      .then(() => {
        if (productionBranch) {
          return createBitbucketFile();
        }
        return Promise.resolve([]);
      })
      .then(filesCreated => {
        if (filesCreated.length > 0) {
          console.log(chalk.cyanBright("Bitbucket file created..."));
          filesCreated.map(x => {
            console.log(chalk.green(x));
          });
        }
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
      const settings = files.readSettingsJson();
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
        default: "development, master",
      },
    ])
    .then(result => {
      if (result.Branches.trim() === "") {
        testBranchesGitlab = "";
        testBranches = [];
        return Promise.resolve();
      }
      let branches = result.Branches.split(",").map(x => x.trim());
      testBranches = branches;
      testBranchesGitlab = ` && (${branches
        .map(branch => {
          if (!branch) {
            throw "No branch name added";
          }
          return `$CI_MERGE_REQUEST_TARGET_BRANCH_NAME == \"${branch}\"`;
        })
        .join(" || ")})`;
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
        default: "master",
      },
    ])
    .then(result => {
      if (result.Branch.trim() === "") {
        productionBranchGitlab = "";
        productionBranch = "";
        return Promise.resolve();
      }
      productionBranch = result.Branch;
      productionBranchGitlab = `$CI_COMMIT_BRANCH == "${result.Branch}"`;
      return Promise.resolve();
    });
}

function askTestTreshold() {
  console.log(chalk.cyanBright("Edit jest config in package.json"));

  execSync('npm pkg set jest.preset="react-native"');
  execSync("npm pkg set jest.collectCoverage=true --json");
  execSync("npm pkg delete jest.collectCoverageFrom");
  execSync(
    'npm pkg set jest.collectCoverageFrom[]="src/**/*.{js,jsx}" jest.collectCoverageFrom[]="!src/**/actions/**/*.{js,jsx}"'
  );
  execSync("npm pkg delete jest.coverageReporters");
  execSync(
    'npm pkg set jest.coverageReporters[]="clover" jest.coverageReporters[]="json" jest.coverageReporters[]="lcov" jest.coverageReporters[]="text" jest.coverageReporters[]="cobertura"'
  );

  execSync('npm pkg set jest-junit.suiteName="React-Native Unit Tests"');
  execSync('npm pkg set jest-junit.classNameTemplate="{classname}"');
  execSync('npm pkg set jest-junit.titleTemplate="{title}"');
  execSync('npm pkg set jest-junit.ancestorSeparator=" › "');
  execSync('npm pkg set jest-junit.suiteNameTemplate="{filename}"');

  execSync('npm pkg set scripts.test="jest --ci --reporters=default --reporters=jest-junit"');

  const settings = files.readSettingsJson();

  let devpackages = ["jest-junit"];
  if (settings.installer === "npm") {
    install.installNPM([], devpackages);
  } else if (settings.installer === "yarn") {
    install.installYarn([], devpackages);
  }

  return inquirer
    .prompt([
      {
        type: "confirm",
        name: "setThreshold",
        message: "Do you want to set a threshold percentage for the test coverage of your project?",
        default: true,
      },
    ])
    .then(result => {
      if (result.setThreshold) {
        return inquirer.prompt([
          {
            type: "number",
            name: "branchesThreshold",
            message: "Threshold on branches",
            default: 70,
          },

          {
            type: "number",
            name: "functionsThreshold",
            message: "Threshold on functions",
            default: 70,
          },

          {
            type: "number",
            name: "linesThreshold",
            message: "Threshold on lines",
            default: 70,
          },

          {
            type: "number",
            name: "statementsThreshold",
            message: "Threshold on statements",
            default: 70,
          },
        ]);
      }
      return Promise.reject();
    })
    .then(thresholds => {
      execSync(
        `npm pkg set jest.coverageThreshold.global.branches="${thresholds.branchesThreshold}" jest.coverageThreshold.global.functions="${thresholds.functionsThreshold}" jest.coverageThreshold.global.lines="${thresholds.linesThreshold}" jest.coverageThreshold.global.statements="${thresholds.statementsThreshold}" --json`
      );
    })
    .catch(() => {
      console.log(chalk.magenta("Skipping Threshold setup"));
    })
    .finally(() => {
      return Promise.resolve();
    });
}

function createGitlabFile() {
  console.log(chalk.cyanBright("Now starting on the creation of your gitlab file..."));
  let createdPath = "";
  createdPath = files.copyFolder(
    path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "cicd", "gitlab-example.yml"),
    path.join(process.cwd(), ".gitlab-ci.yml")
  );

  let unitTestJob = "";
  let lintTestJob = "";
  let pagesJob = "";
  if (testBranchesGitlab || productionBranchGitlab) {
    unitTestJob = gitlabJobs.unitTest;
    lintTestJob = gitlabJobs.linTest;
    if (testBranchesGitlab) {
      console.log(testBranchesGitlab);
      unitTestJob = unitTestJob.replace("<TESTBRANCHES>", testBranchesGitlab);
      lintTestJob = lintTestJob.replace("<TESTBRANCHES>", testBranchesGitlab);
    } else {
      unitTestJob = unitTestJob.replace("<TESTBRANCHES>", "");
      lintTestJob = lintTestJob.replace("<TESTBRANCHES>", "");
    }

    if (productionBranchGitlab) {
      unitTestJob = unitTestJob.replace("<PRODBRANCH>", "|| " + productionBranchGitlab);
      pagesJob = gitlabJobs.pages.replace("<PRODBRANCH>", productionBranchGitlab);
    } else {
      unitTestJob = unitTestJob.replace("<PRODBRANCH>", "");
    }
  }

  files.replaceInFiles(createdPath, "<UNITTEST>", unitTestJob);
  files.replaceInFiles(createdPath, "<LINTTEST>", lintTestJob);
  files.replaceInFiles(createdPath, "<PAGES>", pagesJob);
  return Promise.resolve([createdPath]);
}

async function createGithubFile() {
  console.log(chalk.cyanBright("Now starting on the creation of your github files..."));

  return files
    .fileExistsOrCreate(path.join(process.cwd(), ".github/workflows/testsOnPR.yml"))
    .then(() => {
      return files.fileExistsOrCreate(path.join(process.cwd(), ".github/workflows/testsOnPush.yml"));
    })
    .then(() => {
      let createdPathPR = "";
      let createdPathPush = "";
      createdPathPR = files.copyFolder(
        path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "cicd", "github-pullRequest-example.yml"),
        path.join(process.cwd(), ".github/workflows/testsOnPR.yml")
      );

      createdPathPush = files.copyFolder(
        path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "cicd", "github-push-example.yml"),
        path.join(process.cwd(), ".github/workflows/testsOnPush.yml")
      );

      let PRBranches = "";
      let pushBranches = "";

      testBranches.map(branch => {
        PRBranches = PRBranches + `      - '${branch}'` + os.EOL;
      });
      pushBranches = `      - '${productionBranch}'`;

      files.replaceInFiles(createdPathPR, "<BRANCHES>", PRBranches);
      files.replaceInFiles(createdPathPush, "<BRANCHES>", pushBranches);
      return Promise.resolve([createdPathPR, createdPathPush]);
    });
}

async function createBitbucketFile() {
  console.log(chalk.cyanBright("Now starting on the creation of your bitbucket files..."));

  let createdPath = "";
  createdPath = files.copyFolder(
    path.resolve(DIRNAME, "..", "..", "reactnative", "examples", "cicd", "bitbucket-example.yml"),
    path.join(process.cwd(), "bitbucket-pipelines.yml")
  );

  files.replaceInFiles(createdPath, "<PRODBRANCH>", productionBranch);
  return Promise.resolve([createdPath]);
}

export const gitlabJobs = {
  unitTest:
    "unit-test-job:" +
    os.EOL +
    "  stage: test" +
    os.EOL +
    "  script:" +
    os.EOL +
    "    - yarn test" +
    os.EOL +
    "  rules:" +
    os.EOL +
    "    - if: ($CI_PIPELINE_SOURCE == 'merge_request_event'<TESTBRANCHES>) <PRODBRANCH>" +
    os.EOL +
    "      when: always" +
    os.EOL +
    "  coverage: '/All files[^|]*|[^|]*s+([d.]+)/'" +
    os.EOL +
    "  artifacts:" +
    os.EOL +
    "      when: always" +
    os.EOL +
    "      paths:" +
    os.EOL +
    "        - coverage/lcov-report" +
    os.EOL +
    "        - coverage/cobertura-coverage.xml" +
    os.EOL +
    "        - junit.xml" +
    os.EOL +
    "      reports:" +
    os.EOL +
    "        junit:" +
    os.EOL +
    "          - junit.xml" +
    os.EOL +
    "        coverage_report:" +
    os.EOL +
    "          coverage_format: cobertura" +
    os.EOL +
    "          path: coverage/cobertura-coverage.xml",

  linTest:
    "lint-test-job:" +
    os.EOL +
    "  stage: test" +
    os.EOL +
    "  script:" +
    os.EOL +
    "    - yarn lint" +
    os.EOL +
    "  rules:" +
    os.EOL +
    "    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'<TESTBRANCHES>" +
    os.EOL +
    "      when: always",

  pages:
    "pages:" +
    os.EOL +
    "  stage: report-coverage" +
    os.EOL +
    "  dependencies:" +
    os.EOL +
    "    - unit-test-job" +
    os.EOL +
    "  script:" +
    os.EOL +
    "    - mv coverage/lcov-report/ public/" +
    os.EOL +
    "  artifacts:" +
    os.EOL +
    "    paths:" +
    os.EOL +
    "      - public/" +
    os.EOL +
    "  rules:" +
    os.EOL +
    "    - if: <PRODBRANCH>" +
    os.EOL +
    "      when: always",
};
