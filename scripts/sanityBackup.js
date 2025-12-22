import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import 'dotenv/config';

// Ensure backups folder exists
const backupDir = path.join(process.cwd(), "backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Timestamp
const now = new Date();
const timestamp = now
  .toISOString()
  .replace(/T/, "_")
  .replace(/:/g, "-")
  .replace(/\..+/, "");

// File path
const outputFile = path.join(backupDir, `sanity-backup-${timestamp}.tar.gz`);

// Sanity project details (env required)
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";

if (!projectId) {
  console.error("❌ Missing SANITY_PROJECT_ID env variable");
  process.exit(1);
}

console.log(`📦 Exporting Sanity dataset "${dataset}"...`);
console.log(`📁 Saving to: ${outputFile}`);

try {
  execSync(
    `sanity dataset export ${dataset} "${outputFile}" --project ${projectId}`,
    { stdio: "inherit" }
  );

  console.log("✅ Backup complete!");
  console.log(`➡️  File saved: backups/sanity-backup-${timestamp}.tar.gz`);
} catch (err) {
  console.error("❌ Backup failed:");
  console.error(err);
  process.exit(1);
}
