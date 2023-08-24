import settings from "../utils/settings";
import {files} from "./files";
import path from "path";

/**
 *
 * SUPER IMPORTANT WHEN CREATING A NEW VERSION
 * Change the settings.mjs file in the utils folder to reflect the new version you created
 *
 */
const migrate = from => {
  return new Promise((resolve, reject) => {
    const currentVersion = settings.version;
    let configVersion = from;
    let config = files.readSettingsJson();
    for (let i = configVersion; i <= currentVersion; i++) {
      /** VERSION 0 --> 1 */
      if (i === 0) {
        config.version = 1;
        const fileWritten = files.overwriteFileSync(
          path.join(process.cwd(), "planter.config.json"),
          JSON.stringify(config, null, 2)
        );
        if (!fileWritten) {
          reject("Could not write planter config file.");
        }
      }

      /** RESOLVING VERSION */
      if (i === currentVersion) {
        resolve();
      }
    }
  });
};

export const migrator = {
  check: () => {
    const {version} = files.readSettingsJson();
    let configVersion = 0;
    if (version !== undefined) {
      configVersion = version;
    }
    return migrate(configVersion);
  },
};
