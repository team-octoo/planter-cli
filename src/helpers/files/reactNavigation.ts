import chalk from "chalk";
import fs from "fs";
import {files} from "../files";
import path from "path";
import {detect} from "../detect";
import os from "os";
import {DIRNAME} from "../../globals";
function findFileInPath(filePath, fileName) {
  const dirContent = fs.readdirSync(filePath, {withFileTypes: true});

  let pathToReturn = "";
  dirContent.find(element => {
    if (element.isDirectory()) {
      pathToReturn = findFileInPath(path.join(filePath, element.name), fileName);
      return pathToReturn !== "";
    }
    if (element.name === fileName) {
      pathToReturn = path.join(filePath, element.name);
      return true;
    }

    return false;
  });
  return pathToReturn;
}

function replacePackageContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();

  fileContent = fileContent.replace(
    "package com.plantertestnavigation;",
    "package com.plantertestnavigation;" + os.EOL + os.EOL + "import android.os.Bundle;"
  );

  fileContent = fileContent.replace(
    "public class MainActivity extends ReactActivity {",
    "public class MainActivity extends ReactActivity {" +
      os.EOL +
      os.EOL +
      "  @Override" +
      os.EOL +
      "  protected void onCreate(Bundle savedInstanceState) {" +
      os.EOL +
      "    super.onCreate(null);" +
      os.EOL +
      "  }"
  );
  fs.writeFileSync(filePath, fileContent);
  return true;
}

export const reactNavigation = {
  // setup steps for package
  setupPackage: () => {
    //if .env.development or .env.production exists
    return new Promise((resolve, reject) => {
      const mainActivityFile = findFileInPath(
        path.join(process.cwd(), "android", "app", "src", "main", "java"),
        "MainActivity.java"
      );
      console.log(`Path to MainActivity: ${mainActivityFile}`);
      if (mainActivityFile) {
        replacePackageContent(mainActivityFile);
      }

      resolve("React Navigation setup completed");
    });
  },

  copyNavigatorFiles: type => {
    const settings = files.readSettingsJson();
    console.log("Creating Native Stack MainNavigation...");

    if (
      !files.fileExists(path.join(process.cwd(), "src", "components", "navigation", "MainNavigation.js")) &&
      !files.fileExists(
        path.join(process.cwd(), "src", "components", "navigation", "MainNavigation", "MainNavigation.tsx")
      )
    ) {
      fs.copyFileSync(
        path.resolve(
          DIRNAME,
          "reactnative",
          "examples",
          "navigation",
          settings.hasTs ? "ts" : "js",
          settings.hasTs ? `${type}.tsx` : `${type}.js`
        ),
        path.join(
          process.cwd(),
          "src",
          "components",
          "navigation",
          settings.hasTs ? "MainNavigation/MainNavigation.tsx" : "MainNavigation.js"
        )
      );
    }

    if (
      settings.hasTs &&
      !files.fileExists(
        path.join(process.cwd(), "src", "components", "navigation", "MainNavigation", "MainNavigation.types.tsx")
      )
    ) {
      fs.copyFileSync(
        path.resolve(DIRNAME, "reactnative", "examples", "navigation", "ts", "MainNavigation.types.ts"),
        path.join(process.cwd(), "src", "components", "navigation", "MainNavigation", "MainNavigation.types.ts")
      );
    }
  },
};
