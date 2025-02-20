#!/usr/bin/env node
import { mkdirSync, existsSync, renameSync } from "fs";
import { resolve } from "path";
const distDir = resolve(process.cwd(), "dist");
const unusedDir = resolve(distDir, "unused");
const indexPath = resolve(distDir, "index.html");
const newIndexPath = resolve(unusedDir, "index.html");
try {
    // Create the 'dist/unused' directory if it doesn't exist
    if (!existsSync(unusedDir)) {
        mkdirSync(unusedDir, { recursive: true });
        console.log(`Created directory: ${unusedDir}`);
    }
    // Move 'dist/index.html' to 'dist/unused/index.html'
    if (existsSync(indexPath)) {
        renameSync(indexPath, newIndexPath);
        console.log(`Moved ${indexPath} to ${newIndexPath}`);
    }
    else {
        console.log(`File not found: ${indexPath}`);
    }
}
catch (error) {
    console.error("Error moving index.html:", error);
}
