import chalk from "chalk";
import {PlanterConfigV2} from "./migrator";
import {assertNever} from "./assert-never";

export type StructureType = "BEP (recommended)" | "Atomic" | "Custom";

export function getComponentStructureConfig(structure: StructureType): PlanterConfigV2["components"] {
  if (structure === "BEP (recommended)")
    return {
      blocks: {
        component: "src/components/blocks/@camelCase/@camelCase.@ext",
        style: "src/components/blocks/@camelCase/@camelCase.@ext",
        test: "src/components/blocks/@camelCase/tests/@camelCase.test.@ext",
      },
      elements: {
        component: "src/components/elements/@camelCase/@camelCase.@ext",
        style: "src/components/elements/@camelCase/@camelCase.@ext",
        test: "src/components/elements/@camelCase/tests/@camelCase.test.@ext",
      },
      pages: {
        component: "src/components/pages/@camelCase/@camelCase.@ext",
        style: "src/components/pages/@camelCase/@camelCase.@ext",
        test: "src/components/pages/@camelCase/tests/@camelCase.test.@ext",
      },
    };
  if (structure === "Atomic")
    return {
      atoms: {
        component: "src/components/atoms/@camelCase/@camelCase.@ext",
        style: "src/components/atoms/@camelCase/@camelCase.@ext",
        test: "src/components/atoms/@camelCase/tests/@camelCase.test.@ext",
      },
      molecules: {
        component: "src/components/molecules/@camelCase/@camelCase.@ext",
        style: "src/components/molecules/@camelCase/@camelCase.@ext",
        test: "src/components/molecules/@camelCase/tests/@camelCase.test.@ext",
      },
      organisms: {
        component: "src/components/organisms/@camelCase/@camelCase.@ext",
        style: "src/components/organisms/@camelCase/@camelCase.@ext",
        test: "src/components/organisms/@camelCase/tests/@camelCase.test.@ext",
      },
      templates: {
        component: "src/components/templates/@camelCase/@camelCase.@ext",
        style: "src/components/templates/@camelCase/@camelCase.@ext",
        test: "src/components/templates/@camelCase/tests/@camelCase.test.@ext",
      },
      pages: {
        component: "src/components/pages/@camelCase/@camelCase.@ext",
        style: "src/components/pages/@camelCase/@camelCase.@ext",
        test: "src/components/pages/@camelCase/tests/@camelCase.test.@ext",
      },
    };
  if (structure === "Custom") {
    console.log(chalk.yellow("!! After the setup, define your own custom component structure in the config file !!"));
    return {};
  }

  return assertNever(structure);
}
