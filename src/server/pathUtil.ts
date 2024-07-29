// pathUtil.mjs
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name of the current module
export const __dirname = dirname(fileURLToPath(import.meta.url));
