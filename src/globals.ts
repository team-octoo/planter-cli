import {fileURLToPath} from "url";
import {dirname} from "path";

// // @ts-ignore
// export const FILENAME = fileURLToPath(import.meta.url);
export const FILENAME = fileURLToPath(`file://${__dirname}`);
export const DIRNAME = dirname(FILENAME);
