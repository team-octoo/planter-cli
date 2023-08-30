import {PlanterConfigV2} from "../helpers/migrator";
import {getComponentStructureConfig} from "../helpers/structure-type";

let settings: PlanterConfigV2 = {
  version: 2,
  name: "name",
  library: "react",
  installer: "npm",
  hasTs: false,
  layout: "css",
  packages: [],
  structure: "BEP (recommended)",
  components: getComponentStructureConfig("BEP (recommended)"),
};

export default settings;
