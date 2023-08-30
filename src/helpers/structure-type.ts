import chalk from "chalk";
import {PlanterConfigV2} from "./migrator";
import {assertNever} from "./assert-never";

export type StructureType = "BEP (recommended)" | "Atomic" | "Custom";

export function getComponentStructureConfig(structure: StructureType): PlanterConfigV2["components"] {
  if (structure === "BEP (recommended)")
    return {
      blocks: {
        component: "src/components/blocks",
        style: "src/components/blocks",
        test: "src/components/blocks/test",
      },
      elements: {
        component: "src/components/elements",
        style: "src/components/elements",
        test: "src/components/elements/test",
      },
      pages: {
        component: "src/components/pages",
        style: "src/components/pages",
        test: "src/components/pages/test",
      },
    };
  if (structure === "Atomic")
    return {
      atoms: {
        component: "src/components/atoms",
        style: "src/components/atoms",
        test: "src/components/atoms/test",
      },
      molecules: {
        component: "src/components/molecules",
        style: "src/components/molecules",
        test: "src/components/molecules/test",
      },
      organisms: {
        component: "src/components/organisms",
        style: "src/components/organisms",
        test: "src/components/organisms/test",
      },
      templates: {
        component: "src/components/templates",
        style: "src/components/templates",
        test: "src/components/templates/test",
      },
      pages: {
        component: "src/components/pages",
        style: "src/components/pages",
        test: "src/components/pages/test",
      },
    };
  if (structure === "Custom") {
    console.log(chalk.yellow("!! After the setup, define your own custom component structure in the config file !!"));
    return {};
  }

  return assertNever(structure);
}
