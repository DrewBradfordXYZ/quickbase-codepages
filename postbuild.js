import { chmodSync } from "fs";
import { resolve } from "path";

const filePath = resolve("dist/index.js");

// Ensure the file has the correct permissions
chmodSync(filePath, "755");
