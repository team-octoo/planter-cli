import path from "path";
import {files} from "./helpers/files";

export const folders = {
  add: async name => {
    const config = files.readSettingsJson();
    config.components[name] = {component: "", style: "", test: ""};
    config.components[name].component = "src/components/" + name + "/@pascalCase/@pascalCase.@ext";
    config.components[name].style = "src/components/" + name + "/@pascalCase/@pascalCase.@ext";
    config.components[name].test = "src/components/" + name + "/@pascalCase/tests/@pascalCase.@ext";
    files.overwriteFile(path.join(process.cwd(), "planter.config.json"), JSON.stringify(config, null, 2));
  },
};
