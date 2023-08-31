import settings from "../utils/settings";
import {files} from "./files";
import path from "path";
import {StructureType} from "./structure-type";

type ComponentOptionsV0 = {
  [key: string]: "folder" | ComponentOptionsV0;
};

export type PlanterConfigV0 = {
  version: 0;
  name: string;
  library: "react" | "react-native";
  installer: "npm" | "yarn";
  hasTs: boolean;
  layout: "css" | "css modules" | "sass" | "sass modules" | "Styled-components";
  packages: string[];
  components: ComponentOptionsV0;
  structure: StructureType;
  usePropTypes?: boolean;
  mswPath?: string;
  postbuild?: any;
};

export type PlanterConfigV1 = Omit<PlanterConfigV0, "version"> & {
  version: 1;
};

export type PlanterConfigV2 = Omit<PlanterConfigV1, "version" | "components"> & {
  version: 2;
  components: Record<
    string,
    {
      component: string;
      style?: string;
      test?: string;
    }
  >;
};

export type PlanterConfigV3 = Omit<PlanterConfigV2, "version"> & {
  version: 3;
};

/**
 *
 * SUPER IMPORTANT WHEN CREATING A NEW VERSION
 * Change the settings.ts file in the utils folder to reflect the new version you created
 *
 */
const migrate = from => {
  return new Promise<void>((resolve, reject) => {
    const currentVersion = settings.version;
    let configVersion = from;

    let config = files.readSettingsJson() as any;
    for (let i = configVersion; i <= currentVersion; i++) {
      /** VERSION 0 --> 1 */
      if (i === 0) {
        config.version = 1;
      }

      if (i === 1) {
        config.version = 2;

        const oldOptions = getChildFoldersV1(config.components).map(pathArray => path.join(...pathArray));

        const newOptions: PlanterConfigV2["components"] = {};

        for (const oldOption of oldOptions) {
          newOptions[oldOption] = {
            component: path.join("src", "components", oldOption),
            style: path.join("src", "components", oldOption),
            test: path.join("src", "components", oldOption, "test"),
          };
        }

        config.components = newOptions;
      }

      if (i === 2) {
        config.version = 3;

        config.components = Object.fromEntries(
          Object.entries(config.components as PlanterConfigV2["components"]).map(([key, value]) => [
            key,
            Object.fromEntries(Object.entries(value).map(([key, value]) => [key, path.join(value, "@pascalCase")])),
          ])
        );
      }

      /** RESOLVING VERSION */
      if (i === currentVersion) {
        break;
      }
    }

    files.overwriteFile(path.join(process.cwd(), "planter.config.json"), JSON.stringify(config, null, 2));
    resolve();
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

function getChildFoldersV1(config: PlanterConfigV1["components"], basePath: string[] = []): string[][] {
  return Object.entries(config).flatMap(([element, value]) => {
    const path = [...basePath, element];

    if (typeof value === "string") return [path];

    return getChildFoldersV1(value, path);
  });
}
