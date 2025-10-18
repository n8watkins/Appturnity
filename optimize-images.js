import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const PUBLIC_DIR = "./client/public";
const TARGET_IMAGES = ["portrait.jpg", "riverwood.png", "guardcast.png", "appturnity.png"];

async function optimizeImage(filename) {
  const inputPath = join(PUBLIC_DIR, filename);
  const stats = await stat(inputPath);
  const originalSize = stats.size;

  console.log(`\nOptimizing ${filename}...`);
  console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KB`);

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Determine max width based on image
  let maxWidth = 1200;
  if (filename.includes("portrait")) {
    maxWidth = 800; // Portrait doesn't need to be huge
  } else if (filename.includes("icon")) {
    maxWidth = 500; // Icons smaller
  }

  // Resize if too large
  const resizeOptions = metadata.width > maxWidth ? { width: maxWidth } : {};

  // Convert to WebP for better compression
  const webpFilename = filename.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  const outputPath = join(PUBLIC_DIR, webpFilename);

  await image
    .resize(resizeOptions)
    .webp({ quality: 85 }) // 85% quality - good balance
    .toFile(outputPath);

  const newStats = await stat(outputPath);
  const newSize = newStats.size;
  const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

  console.log(`New size: ${(newSize / 1024).toFixed(2)} KB (${savings}% smaller)`);
  console.log(`Saved as: ${webpFilename}`);
}

async function main() {
  console.log("Starting image optimization...\n");
  console.log("Converting to WebP format for better compression...");

  for (const filename of TARGET_IMAGES) {
    try {
      await optimizeImage(filename);
    } catch (error) {
      console.error(`Error optimizing ${filename}:`, error.message);
    }
  }

  console.log("\n✅ Image optimization complete!");
  console.log("\nNext steps:");
  console.log("1. Update components to use .webp files");
  console.log("2. Add <picture> tags with fallbacks for older browsers");
}

main().catch(console.error);
