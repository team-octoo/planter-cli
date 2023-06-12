import {files} from "./files.mjs";
import path from "path";

const migrate = from => {
  return new Promise((resolve, reject) => {
    const currentVersion = 1;
    let configVersion = from;
    let config = {...files.readSettingsJson()};
    for (let i = configVersion; i <= currentVersion; i++) {
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
