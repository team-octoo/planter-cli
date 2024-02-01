#! /usr/bin/env node

import {Argument, Command} from "commander";
import chalk from "chalk";
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
import {files} from "./helpers/files";
import store from "./react/store";
import {setup as cicdSetup} from "./reactnative/setupCICD";
import {form} from "./reactnative/react-native-form";
import {migrator} from "./helpers/migrator";
import {install} from "./helpers/install";
import {docs} from "./helpers/docs";
import {folders} from "./folders";

import {dataModel} from "./reactnative/react-native-datamodel";

let packageJson;
try {
  packageJson = files.readPlanterPackageJson();
} catch (err) {
  //if no packagejson is detected, the user will be presented with the choice of react or react-native
}
const program = new Command();

program.description("React & React-native CLI tool for structured applications.");
program.name("planter");
program.usage("<command>");
program.version(packageJson.version);

program
  .command("init")
  .description("Initialise the CLI to create a new project with opinionated structure.")
  .option("--force", "Forces to create a new planter config file")
  .action((str, options) => {
    intro
      .play()
      .then(() => detect.config(str.force))
      .then(result => {
        if (result === false) {
          // a planter config has been detected
          throw new Error("Planter config file detected... Try 'planter install' command or use the --force option.");
        }
        return detect.library();
      })
      .then(library => {
        settings.library = library as any;
        if (settings.library === "install") {
          //no library detected... asking what to install.
          install.library();
        } else if (settings.library === "react") {
          reactInit.initialise();
        } else if (settings.library === "react-native") {
          reactNativeInit.initialise();
        } else {
          console.log("Something went terribly wrong finding the library you are using...");
        }
      })
      .catch(err => {
        console.log(chalk.red(err));
      });
  });

program
  .command("install")
  .description("Install everything according to the planter config file.")
  .action(() => {
    intro
      .play()
      .then(() => detect.config())
      .then(result => {
        if (result === false) {
          //a config file has been detected
          migrator
            .check()
            .then(() => {
              return detect.library();
            })
            .then(library => {
              if (library === "install") {
                install.libraryFromConfig();
                return "ok";
              } else {
                return "ok";
              }
            })
            .then(() => {
              packageJson = files.readPlanterPackageJson();
              return install.full();
            })
            .then(result => {
              if (result) console.log(chalk.green(result));
              return docs.writeDocs(true);
            })
            .then(() => {
              detect.library().then(library => {
                if (library === "react") {
                  console.log(chalk.greenBright("Initialisation has been completed. Have fun creating!"));
                } else if (library === "react-native") {
                  reactNativeInit.postinstall();
                } else {
                  throw new Error("Error: React or React-Native not detected...");
                }
              });
            });
        }
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
  .option("--folder", "Add the component immediately to this folder")
  .argument("[foldername]", "Name of the folder in which the component should be created")
  .action((name, foldername) => {
    migrator.check().then(() => {
      const localsettings = files.readSettingsJson();
      if (localsettings.library === "react") {
        reactComponents.create(name, foldername);
      } else if (localsettings.library === "react-native") {
        reactNativeComponents.create(name, foldername);
      }
    });
  });

program
  .command("plant:folder")
  .description("Create a new component folder to use in the plant:component command (use / to have subfolders)")
  .argument("<name>", "Name of the folder you wish to plant (use / to have subfolders)")
  .action(name => {
    migrator.check().then(() => {
      folders.add(name);
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

program
  .command("plant:dataModel")
  .description(
    "Creates a data model with hooks for fetching data, types when using typescript and zustand or redux stores when those packages are selected"
  )

  .option(
    "-S, --no-state",
    "don't create state files for this model (Zustand/Redux). [Only taken into account when Redux or Zustand is found in the project]"
  )
  .option("-T, --no-types", "don't create Type files for this model. [Only taken into account when typescript Project]")
  .option("-H, --no-hooks", "don't create CRUD hooks for this model")
  .option("-P, --no-parsers", "don't create  parsers for this model")
  .argument("[name]", "Name of your data model")
  .action((name, options) => {
    const localsettings = files.readSettingsJson();
    migrator
      .check()
      .then(() => {
        if (localsettings.library !== "react-native") {
          console.log(chalk.red(`data models cannot be used in ${localsettings.library} at this time.`));
          return;
        }
        return dataModel.create(name, {
          ...options,
          state:
            (localsettings.packages.includes("Redux") || localsettings.packages.includes("Zustand")) && options.state,
        });
      })
      .then(() => console.log("done"))
      .catch(error => {
        console.log(chalk.red(error));
      });
  });

program.parse(process.argv);
