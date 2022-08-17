#! /usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { detect } from "./helpers/detect.mjs";
import { intro } from "./helpers/intro.mjs";
import { reactInit } from "./react/react-init.mjs";
import settings from "./utils/settings.mjs";
import { reactNativeInit } from "./reactnative/react-native-init.mjs";
import context from "./react/context.mjs";
import hook from "./react/hook.mjs";
import { reactData } from "./react/react-data.mjs";
import { reactFuncs } from "./react/react-funcs.mjs";
import { reactComponents } from "./react/react-component.mjs";
import reducer from "./react/reducer.mjs";
import mock from "./react/mock.mjs";
import { reactNativeComponents } from "./reactnative/react-native-component.mjs";

import { DIRNAME } from "./helpers/globals/globals.js";
const packageJson = JSON.parse(fs.readFileSync(path.join(DIRNAME, "..", "..", "..", "package.json")));
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
      .then((library) => {
        settings.library = library;
        console.log(library);
        if (library === "react") {
          reactInit.initialise();
        } else if (library === "react-native") {
          reactNativeInit.initialise();
        }
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  });

program
  .command("plant:context")
  .description("Makes a React context file")
  .argument("<string>", "name of the context element")
  .action((elementName) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
    if (localsettings.library === "react") {
      context.createContext(elementName);
    } else if (localsettings.library === "react-native") {
      context.createContext(elementName);
    }
  });

program
  .command("plant:hook")
  .description("Makes a custom React hook")
  .argument("<string>", "name of the hook element")
  .action((elementName) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

    if (localsettings.library === "react") {
      hook.createHook(elementName);
    } else if (localsettings.library === "react-native") {
      hook.createHook(elementName);
    }
  });

program
  .command("plant:data")
  .description("Makes a data file for exporting a value constant")
  .argument("<string>", "name")
  .action((name, options) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

    if (localsettings.library === "react") {
      reactData.create(name);
    } else if (localsettings.library === "react-native") {
      reactData.create(name);
    }
  });

program
  .command("plant:function")
  .description("Makes a function file to export a shared function")
  .argument("<string>", "name")
  .action((name, options) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

    if (localsettings.library === "react") {
      reactFuncs.create(name);
    } else if (localsettings.library === "react-native") {
      reactFuncs.create(name);
    }
  });

program
  .command("plant:component")
  .description("Makes a component according to the chosen structure")
  .argument("<string>", "name")
  .action((name) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));
    if (localsettings.library === "react") {
      reactComponents.create(name);
    } else if (localsettings.library === "react-native") {
      reactNativeComponents.create(name);
    }
  });

program
  .command("plant:reducer")
  .description("Makes a reducer and action (Redux only)")
  .argument("<string>", "name")
  .action((name, options) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

    if (localsettings.library === "react") {
      reducer.create(name);
    } else if (localsettings.library === "react-native") {
      reducer.create(name);
    }
  });

program
  .command("plant:store")
  .description("Makes a store (Zustand only)")
  .argument("<string>", "name")
  .action((name, options) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

    if (localsettings.library === "react") {
      // TODO :: create zustand store
    } else if (localsettings.library === "react-native") {
      // TODO :: create zustand store
    } else {
      console.log(chalk.red("React or React-Native is required for this command."));
    }
  });

program
  .command("plant:mock")
  .description("Makes a mock service worker file")
  .argument("<string>", "name")
  .action((name, options) => {
    const localsettings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "planter.config.json").toString()));

    if (localsettings.library === "react") {
      mock.create(name);
    } else if (localsettings.library === "react-native") {
      console.log(chalk.red("Mock service worker cannot be used in react-native at this time..."));
    }
  });

program.parse(process.argv);
