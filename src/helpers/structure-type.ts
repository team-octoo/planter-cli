import chalk from "chalk";
import {PlanterConfigV6} from "./migrator";
import {assertNever} from "./assert-never";

export type StructureType = "BEP (recommended)" | "Atomic" | "Custom";

export function getComponentStructureConfig(structure: StructureType): PlanterConfigV6["components"] {
  if (structure === "BEP (recommended)")
    return {
      basics: {
        component: "src/components/basics/@pascalCase/@pascalCase.@ext",
        style: "src/components/basics/@pascalCase/@pascalCase.@ext",
        test: "src/components/basics/@pascalCase/tests/@pascalCase.@ext",
      },
      elements: {
        component: "src/components/elements/@pascalCase/@pascalCase.@ext",
        style: "src/components/elements/@pascalCase/@pascalCase.@ext",
        test: "src/components/elements/@pascalCase/tests/@pascalCase.@ext",
      },
      pages: {
        component: "src/components/pages/@pascalCase/@pascalCase.@ext",
        style: "src/components/pages/@pascalCase/@pascalCase.@ext",
        test: "src/components/pages/@pascalCase/tests/@pascalCase.@ext",
      },
    };
  if (structure === "Atomic")
    return {
      atoms: {
        component: "src/components/atoms/@pascalCase/@pascalCase.@ext",
        style: "src/components/atoms/@pascalCase/@pascalCase.@ext",
        test: "src/components/atoms/@pascalCase/tests/@pascalCase.@ext",
      },
      molecules: {
        component: "src/components/molecules/@pascalCase/@pascalCase.@ext",
        style: "src/components/molecules/@pascalCase/@pascalCase.@ext",
        test: "src/components/molecules/@pascalCase/tests/@pascalCase.@ext",
      },
      organisms: {
        component: "src/components/organisms/@pascalCase/@pascalCase.@ext",
        style: "src/components/organisms/@pascalCase/@pascalCase.@ext",
        test: "src/components/organisms/@pascalCase/tests/@pascalCase.@ext",
      },
      templates: {
        component: "src/components/templates/@pascalCase/@pascalCase.@ext",
        style: "src/components/templates/@pascalCase/@pascalCase.@ext",
        test: "src/components/templates/@pascalCase/tests/@pascalCase.@ext",
      },
      pages: {
        component: "src/components/pages/@pascalCase/@pascalCase.@ext",
        style: "src/components/pages/@pascalCase/@pascalCase.@ext",
        test: "src/components/pages/@pascalCase/tests/@pascalCase.@ext",
      },
    };
  if (structure === "Custom") {
    console.log(chalk.yellow("!! After the setup, define your own custom component structure in the config file !!"));
    return {};
  }

  return assertNever(structure);
}
