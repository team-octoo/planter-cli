import {PlanterConfigV4} from "../helpers/migrator";
import {getComponentStructureConfig} from "../helpers/structure-type";

let settings: PlanterConfigV4 = {
  version: 4,
  name: "name",
  library: "react",
  installer: "npm",
  hasTs: false,
  layout: "css",
  packages: [],
  structure: "BEP (recommended)",

  mswPath: "src/mocks/endpoints",
  miragePath: "src/mocks/endpoints",

  hookPath: "src/utils/hooks",
  dataPath: "src/utils/data",
  funcsPath: "src/utils/funcs",

  assetImagesPath: "src/assets/images",
  assetFontsPath: "src/assets/fonts",
  assetMiscPath: "src/assets/misc",

  contextPath: "src/state/contexts",
  reduxActionPath: "src/state/actions",
  reduxStorePath: "src/state/store",
  reduxReducerPath: "src/state/reducers",
  zustandStoresPath: "src/state/stores",

  localesPath: "src/locales",
  typesPath: "src/types",

  components: getComponentStructureConfig("BEP (recommended)"),
};

export default settings;
