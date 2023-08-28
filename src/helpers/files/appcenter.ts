import fs from "fs";
import os from "os";
import path from "path";
import {files} from "../files";
import {DIRNAME} from "../../globals";

export const appcenter = {
  setupPreBuildScript: () => {
    return new Promise(resolve => {
      if (!files.fileExists(path.join(process.cwd(), "appcenter-pre-build.sh"))) {
        const settings = files.readSettingsJson();
        fs.copyFileSync(
          path.resolve(
            DIRNAME,
            settings.library === "react" ? "react" : "reactnative",
            "examples",
            "appcenter",
            "appcenter-pre-build.sh"
          ),
          path.join(process.cwd(), "appcenter-pre-build.sh")
        );
      }
      resolve("Pre build script created");
    });
  },
};
