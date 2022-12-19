import os from "os";
import fs from "fs";
import path from "path";
import {docsMap} from "../utils/mkdocs.mjs";
import {packageMap} from "../utils/package-map.mjs";
import {files} from "./files.mjs";

export const docs = {
  writeDocs: (rn = false) => {
    return new Promise(resolve => {
      let markdownDocs = "";
      markdownDocs = markdownDocs + docs.intro();
      if (rn === true) {
        markdownDocs = markdownDocs + docs.RNsetup();
      }
      markdownDocs = markdownDocs + docs.layout();
      markdownDocs = markdownDocs + docs.structure();
      markdownDocs = markdownDocs + docs.packages();
      if (rn === true) {
        markdownDocs = markdownDocs + docs.cicd();
      }

      markdownDocs = markdownDocs + os.EOL + os.EOL + "---" + os.EOL + os.EOL;

      let readmeContent = markdownDocs;
      if (files.fileExists(path.join(process.cwd(), "README.md"))) {
        readmeContent = markdownDocs + fs.readFileSync(path.join(process.cwd(), "README.md").toString());
      }
      files.overwriteFile(path.join(process.cwd(), "README.md"), readmeContent).then(() => {
        resolve();
      });
    });
  },

  intro: () => {
    const settings = files.readSettingsJson();

    let introtxt = docsMap.intro;
    introtxt = introtxt.replace("settings.name", settings.name);
    introtxt = introtxt.replace("settings.library", settings.library);
    return introtxt;
  },

  layout: () => {
    const settings = files.readSettingsJson();

    let layouttxt = "";
    if (settings.library === "react-native") {
      layouttxt = layouttxt + docsMap.RNlayout + os.EOL + os.EOL;
    } else {
      layouttxt = layouttxt + docsMap.layout;
      layouttxt = layouttxt.replace("settings.layout", settings.layout);
      if (docsMap[settings.layout] !== undefined) {
        layouttxt = layouttxt + docsMap[settings.layout] + os.EOL + os.EOL;
      }
    }

    return layouttxt;
  },

  structure: () => {
    const settings = files.readSettingsJson();

    let structuretxt = "";
    if (docsMap[settings.structure] !== undefined) {
      structuretxt = "## Component structure  " + os.EOL + os.EOL;
      structuretxt = structuretxt + docsMap[settings.structure] + os.EOL + os.EOL;
    }
    return structuretxt;
  },

  RNsetup: () => {
    let setuptxt = "";
    setuptxt = "## Application  " + os.EOL + os.EOL;
    setuptxt = setuptxt + docsMap.RNsetup + os.EOL + os.EOL;
    return setuptxt;
  },

  packages: () => {
    const settings = files.readSettingsJson();

    let packagetxt =
      "## Packages  " + os.EOL + "These packages were installed at the start of the project:  " + os.EOL + os.EOL;
    settings.packages.forEach(el => {
      if (packageMap[el] !== undefined) {
        packagetxt =
          packagetxt +
          "- **" +
          el +
          "**: " +
          packageMap[el].description +
          os.EOL +
          packageMap[el].docs +
          os.EOL +
          os.EOL;
      }
    });

    return packagetxt;
  },

  cicd: () => {
    let cicdtxt = "## CI/CD Setup  " + os.EOL + os.EOL;
    cicdtxt = cicdtxt + docsMap["CI/CD"] + os.EOL + os.EOL;
    return cicdtxt;
  },
};
