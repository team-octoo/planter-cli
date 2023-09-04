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
  components: getComponentStructureConfig("BEP (recommended)"),
};

export default settings;
