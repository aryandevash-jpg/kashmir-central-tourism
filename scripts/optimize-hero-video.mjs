/**
 * Compresses the home hero video and extracts a poster frame.
 * Requires ffmpeg. Run: npm run video:optimize
 */
import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const dir = resolve(dirname(fileURLToPath(import.meta.url)), "../public/videos");
const source = resolve(dir, "kashmir-himalayas.mp4");
const web = resolve(dir, "kashmir-himalayas.web.mp4");
const poster = resolve(dir, "kashmir-himalayas-poster.jpg");

if (!existsSync(source)) {
  console.error("Missing public/videos/kashmir-himalayas.mp4");
  process.exit(1);
}

try {
  execSync("ffmpeg -version", { stdio: "ignore" });
} catch {
  console.error("ffmpeg is required. Install with: brew install ffmpeg");
  process.exit(1);
}

console.log("Compressing hero video…");
execSync(
  `ffmpeg -y -i "${source}" -an -vf "scale=960:-2" -c:v libx264 -crf 30 -preset medium -movflags +faststart -t 20 "${web}"`,
  { stdio: "inherit" }
);

console.log("Extracting poster frame…");
execSync(
  `ffmpeg -y -i "${source}" -ss 00:00:02 -frames:v 1 -update 1 -q:v 3 "${poster}"`,
  { stdio: "inherit" }
);

console.log("\nDone:");
console.log(`  ${web}`);
console.log(`  ${poster}`);
