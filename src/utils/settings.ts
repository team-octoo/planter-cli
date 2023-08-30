import {PlanterConfigV2} from "../helpers/migrator";

let settings: PlanterConfigV2 = {
  version: 2,
  name: "name",
  library: "react",
  installer: "npm",
  hasTs: false,
  layout: "css",
  packages: [],
  structure: "BEP (recommended)",
  components: {
    blocks: {
      component: "src/components/blocks/@camelCase",
      style: "src/components/blocks/@camelCase",
      test: "src/components/blocks/test/@camelCase",
    },
    elements: {
      component: "src/components/elements/@camelCase",
      style: "src/components/elements/@camelCase",
      test: "src/components/elements/test/@camelCase",
    },
    pages: {
      component: "src/components/pages/@camelCase",
      style: "src/components/pages/@camelCase",
      test: "src/components/pages/test/@camelCase",
    },
  },
};

export default settings;
