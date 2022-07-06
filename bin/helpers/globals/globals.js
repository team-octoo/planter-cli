import { fileURLToPath } from "url";
import { dirname } from "path";

export const FILENAME = fileURLToPath(import.meta.url);
export const DIRNAME = dirname(FILENAME);
