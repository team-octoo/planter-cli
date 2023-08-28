import {fileURLToPath} from "url";
import {dirname} from "path";

// // @ts-ignore
// export const FILENAME = fileURLToPath(import.meta.url);
export const DIRNAME = fileURLToPath(`file://${__dirname}`);
