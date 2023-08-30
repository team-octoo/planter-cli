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
    };
  if (structure === "Atomic")
    return {
      atoms: {
        component: "src/components/atoms/@camelCase",
        style: "src/components/atoms/@camelCase",
        test: "src/components/atoms/test/@camelCase",
      },
      molecules: {
        component: "src/components/molecules/@camelCase",
        style: "src/components/molecules/@camelCase",
        test: "src/components/molecules/test/@camelCase",
      },
      organisms: {
        component: "src/components/organisms/@camelCase",
        style: "src/components/organisms/@camelCase",
        test: "src/components/organisms/test/@camelCase",
      },
      templates: {
        component: "src/components/templates/@camelCase",
        style: "src/components/templates/@camelCase",
        test: "src/components/templates/test/@camelCase",
      },
      pages: {
        component: "src/components/pages/@camelCase",
        style: "src/components/pages/@camelCase",
        test: "src/components/pages/test/@camelCase",
      },
    };
  if (structure === "Custom") {
    console.log(chalk.yellow("!! After the setup, define your own custom component structure in the config file !!"));
    return {};
  }

  return assertNever(structure);
}
