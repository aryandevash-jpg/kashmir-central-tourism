/**
 * Downloads activity cover images to public/activities/ for offline serving.
 * Run: npm run images:fetch
 */
import { mkdir, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const U = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const IMAGES = {
  "gondola.jpg": U("photo-1605649487212-47bdab064df7"),
  "gondola2.jpg": U("photo-1464822759023-fed622ff2c3b"),
  "trek.jpg": U("photo-1551632811-561732d1e306"),
  "shikara.jpg": U("photo-1573843981267-be1999ff37cd"),
  "shikara-sunset.jpg": U("photo-1506905925346-21bda4d32df4"),
  "floating-market.jpg": U("photo-1555881400-74d7acaacd8b"),
  "great-lakes.jpg": U("photo-1519681393784-d120267933ba"),
  "thajiwas.jpg": U("photo-1626621341517-bbf3d9990a23"),
  "pahalgam.jpg": U("photo-1470071459604-3b5ec3a7fe05"),
  "skiing.jpg": U("photo-1551698618-1dfe5d97d256"),
  "skiing-adv.jpg": U("photo-1551524559-8af4e6624178"),
  "rafting.jpg": U("photo-1547036967-23d11aacaee0"),
  "aru.jpg": U("photo-1470252649378-9c29740c9fa8"),
  "tarsar.jpg": U("photo-1432405972618-c60b0225b8f9"),
  "default.jpg": U("photo-1544735716-392fe2489ffa"),
  "fallback.jpg": U("photo-1544735716-392fe2489ffa"),
};

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public/activities");

async function main() {
  await mkdir(outDir, { recursive: true });

  for (const [filename, url] of Object.entries(IMAGES)) {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed ${filename}: ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(resolve(outDir, filename), buf);
    console.log(`✓ ${filename}`);
  }

  console.log("\nDone. Images saved to public/activities/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
