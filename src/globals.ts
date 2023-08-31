import {fileURLToPath} from "url";
import path from "path";

export const DIRNAME = fileURLToPath(`file://${path.join(__dirname, "..", "src")}`);
