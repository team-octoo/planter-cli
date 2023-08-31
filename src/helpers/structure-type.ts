import chalk from "chalk";
import {PlanterConfigV2} from "./migrator";
import {assertNever} from "./assert-never";

export type StructureType = "BEP (recommended)" | "Atomic" | "Custom";

export function getComponentStructureConfig(structure: StructureType): PlanterConfigV2["components"] {
  if (structure === "BEP (recommended)")
    return {
      blocks: {
        component: "src/components/blocks/@camelCase",
        style: "src/components/blocks/@camelCase",
        test: "src/components/blocks/@camelCase/test",
      },
      elements: {
        component: "src/components/elements/@camelCase",
        style: "src/components/elements/@camelCase",
        test: "src/components/elements/@camelCase/test",
      },
      pages: {
        component: "src/components/pages/@camelCase",
        style: "src/components/pages/@camelCase",
        test: "src/components/pages/@camelCase/test",
      },
    };
  if (structure === "Atomic")
    return {
      atoms: {
        component: "src/components/atoms/@camelCase",
        style: "src/components/atoms/@camelCase",
        test: "src/components/atoms/@camelCase/test",
      },
      molecules: {
        component: "src/components/molecules/@camelCase",
        style: "src/components/molecules/@camelCase",
        test: "src/components/molecules/@camelCase/test",
      },
      organisms: {
        component: "src/components/organisms/@camelCase",
        style: "src/components/organisms/@camelCase",
        test: "src/components/organisms/@camelCase/test",
      },
      templates: {
        component: "src/components/templates/@camelCase",
        style: "src/components/templates/@camelCase",
        test: "src/components/templates/@camelCase/test",
      },
      pages: {
        component: "src/components/pages/@camelCase",
        style: "src/components/pages/@camelCase",
        test: "src/components/pages/@camelCase/test",
      },
    };
  if (structure === "Custom") {
    console.log(chalk.yellow("!! After the setup, define your own custom component structure in the config file !!"));
    return {};
  }

  return assertNever(structure);
}
