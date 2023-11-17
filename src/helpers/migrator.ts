import settings from "../utils/settings";
import {files} from "./files";
import path from "path";
import {StructureType} from "./structure-type";

export const layoutTypes = ["css", "css-modules", "sass", "sass-modules"] as const;
export type LayoutType = typeof layoutTypes[number];

type ComponentOptionsV0 = {
  [key: string]: "folder" | ComponentOptionsV0;
};

export type PlanterConfigV0 = {
  version: 0;
  name: string;
  library: "react" | "react-native" | "install";
  installer: "npm" | "yarn";
  hasTs: boolean;
  layout: LayoutType;
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

export type PlanterConfigV4 = Omit<PlanterConfigV3, "version"> & {
  version: 4;
  miragePath: string;
  hookPath: string;
  dataPath: string;
  funcsPath: string;
  assetImagesPath: string;
  assetFontsPath: string;
  assetMiscPath: string;
  contextPath: string;
  reduxActionPath: string;
  reduxStorePath: string;
  reduxReducerPath: string;
  zustandStoresPath: string;
  localesPath: string;
  typesPath: string;
};
export type PlanterConfigV5 = Omit<PlanterConfigV4, "version"> & {
  version: 5;
  prettier: boolean;
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
            test: path.join("src", "components", oldOption, "tests"),
          };
        }

        config.components = newOptions;
      }

      if (i === 2) {
        config.version = 3;

        config.components = Object.fromEntries(
          Object.entries(config.components as PlanterConfigV2["components"]).map(([key, value]) => {
            let currentPath = value;
            currentPath.test = currentPath.test.slice(0, -5);
            console.log(currentPath.test);
            return [
              key,
              Object.fromEntries(
                Object.entries(currentPath).map(([key, value]) => [
                  key,
                  path.join(value, key === "test" ? "@pascalCase/tests" : "@pascalCase"),
                ])
              ),
            ];
          })
        );
      }

      if (i === 3) {
        config.version = 4;

        if (config.packages.indexOf("Mock-service-worker") !== -1) {
          if (!config.mswPath) {
            config.mswPath = "src/mocks/endpoints";
          }
        }
        if (config.packages.indexOf("MirageJS") !== -1) {
          if (!config.miragePath) {
            config.miragePath = "src/mocks";
          }
        }

        if (!config.hookPath) {
          config.hookPath = "src/utils/hooks";
        }
        if (!config.dataPath) {
          config.dataPath = "src/utils/data";
        }
        if (!config.funcsPath) {
          config.funcsPath = "src/utils/funcs";
        }

        if (!config.assetImagesPath) {
          config.assetImagesPath = "src/assets/images";
        }
        if (!config.assetFontsPath) {
          config.assetFontsPath = "src/assets/fonts";
        }
        if (!config.assetMiscPath) {
          config.assetMiscPath = "src/assets/misc";
        }

        if (!config.contextPath) {
          config.contextPath = "src/state/contexts";
        }
        if (config.packages.indexOf("Redux") !== -1) {
          if (!config.reduxActionPath) {
            config.reduxActionPath = "src/state/actions";
          }
          if (!config.reduxStorePath) {
            config.reduxStorePath = "src/state/store";
          }
          if (!config.reduxReducerPath) {
            config.reduxReducerPath = "src/state/reducers";
          }
        }

        if (config.packages.indexOf("Zustand") !== -1) {
          if (!config.zustandStoresPath) {
            config.zustandStoresPath = "src/state/stores";
          }
        }

        if (config.packages.indexOf("i18next") !== -1) {
          if (!config.localesPath) {
            config.localesPath = "src/locales";
          }
        }

        if (config.hasTs && !config.typesPath) {
          config.typesPath = "src/types";
        }
        config.components = Object.fromEntries(
          Object.entries(config.components as PlanterConfigV2["components"]).map(([key, value]) => [
            key,
            Object.fromEntries(
              Object.entries(value).map(([key, value]) => {
                let currentEnd = "@pascalCase.@ext";
                if (key === "test") {
                  currentEnd = "@pascalCase.test.@ext";
                }
                return [key, path.join(value, currentEnd)];
              })
            ),
          ])
        );

        config.layout = config.layout.toLowerCase().replace(" ", "-");
      }

      if (i === 4) {
        config.version = 5;
        config.prettier = false;
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
