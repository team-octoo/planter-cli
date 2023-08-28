#! /usr/bin/env node

import {Argument, Command} from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import {detect} from "./helpers/detect";
import {intro} from "./helpers/intro";
import {reactInit} from "./react/react-init";
import settings from "./utils/settings";
import {reactNativeInit} from "./reactnative/react-native-init";
import context from "./react/context";
import hook from "./react/hook";
import {reactData} from "./react/react-data";
import {reactFuncs} from "./react/react-funcs";
import {reactComponents} from "./react/react-component";
import reducer from "./react/reducer";
import mock from "./react/mock";
import {reactNativeComponents} from "./reactnative/react-native-component";
import {DIRNAME} from "./globals";
import {files} from "./helpers/files";
import store from "./react/store";
import {setup as cicdSetup} from "./reactnative/setupCICD";
import {form} from "./reactnative/react-native-form";
import {migrator} from "./helpers/migrator";

const packageJson = files.readPlanterPackageJson();
const program = new Command();

program.description("React & React-native CLI tool for structured applications.");
program.name("planter");
program.usage("<command>");
program.version(packageJson.version);

program
  .command("init")
  .description("Initializes the CLI tool to create a base structure.")
  .option("--force", "Forces to create a new planter config file")
  .action((str, options) => {
    intro
      .play()
      .then(() => {
        return detect.config(str.force);
      })
      .then(() => {
        return detect.library();
      })
      .then(library => {
        settings.library = library;
        if (library === "react") {
          reactInit.initialise();
        } else if (library === "react-native") {
          reactNativeInit.initialise();
        }
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  });

program
  .command("plant:context")
  .description("Makes a React context file")
  .argument("<string>", "name of the context element")
  .action(elementName => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        context.createContext(elementName);
      } else if (localsettings.library === "react-native") {
        context.createContext(elementName);
      }
    });
  });

program
  .command("plant:hook")
  .description("Makes a custom React hook")
  .argument("<string>", "name of the hook element")
  .action(elementName => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        hook.createHook(elementName);
      } else if (localsettings.library === "react-native") {
        hook.createHook(elementName);
      }
    });
  });

program
  .command("plant:data")
  .description("Makes a data file for exporting a value constant")
  .argument("<string>", "name")
  .action((name, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        reactData.create(name);
      } else if (localsettings.library === "react-native") {
        reactData.create(name);
      }
    });
  });

program
  .command("plant:function")
  .description("Makes a function file to export a shared function")
  .argument("<string>", "name")
  .action((name, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        reactFuncs.create(name);
      } else if (localsettings.library === "react-native") {
        reactFuncs.create(name);
      }
    });
  });

program
  .command("plant:component")
  .description("Makes a component according to the chosen structure")
  .argument("<name>", "Name of the component you wish to plant")
  .action(name => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        reactComponents.create(name);
      } else if (localsettings.library === "react-native") {
        reactNativeComponents.create(name);
      }
    });
  });

program
  .command("plant:reducer")
  .description("Makes a reducer and action (Redux only)")
  .argument("<string>", "name")
  .action((name, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        reducer.create(name);
      } else if (localsettings.library === "react-native") {
        reducer.create(name);
      }
    });
  });

program
  .command("plant:store")
  .description("Makes a store (Zustand only)")
  .argument("<string>", "name")
  .action((name, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react" || localsettings.library === "react-native") {
        store.create(name);
      } else {
        console.log(chalk.red("React or React-Native is required for this command."));
      }
    });
  });

program
  .command("plant:mock")
  .description("Makes a mock service worker file")
  .argument("<string>", "name")
  .action((name, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        mock.create(name);
      } else if (localsettings.library === "react-native") {
        console.log(chalk.red("Mock service worker cannot be used in react-native at this time..."));
      }
    });
  });

program
  .command("setup:CI/CD")
  .description("Sets up a CI/CD file for a chosen GitRepo")
  .addArgument(
    new Argument("<git provider>", "Git provider").choices(["gitlab", "github", "azure_devops", "bitbucket"])
  )
  .action((provider, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        console.log(chalk.red("CI/CD creation cannot be used in react at this time..."));
      } else if (localsettings.library === "react-native") {
        switch (provider) {
          case "gitlab":
            cicdSetup.gitlab();
            break;
          case "github":
            cicdSetup.github();
            break;
          case "bitbucket":
            cicdSetup.bitbucket();
            break;
          default:
            console.log(chalk.red("only 'gitlab', 'github' & 'bitbucket' can be used at this time..."));
            break;
        }
      }
    });
  });

program
  .command("plant:form")
  .description("Sets up a new form using React Hook Form")
  .argument("<string>", "name")
  .action((name, options) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library !== "react-native") {
        console.log(chalk.red(`forms cannot be used in ${localsettings.library} at this time.`));
        return;
      }
      form.create(name).finally(() => console.log("done"));
    });
  });

program.parse(process.argv);
