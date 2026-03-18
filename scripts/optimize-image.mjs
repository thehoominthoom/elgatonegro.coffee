/**
 * scripts/optimize-image.mjs
 *
 * Image optimization pre-commit hook.
 *
 * What it does:
 *   Any JPG, JPEG, PNG, GIF, or TIFF staged from public/ is automatically
 *   converted to WebP (quality 75, max 1440px wide) before the commit is
 *   recorded. The original file is deleted. WebP and SVG files are skipped.
 *
 * Invoked by lint-staged via .husky/pre-commit → npx lint-staged.
 * lint-staged passes all matched staged file paths as arguments to this script.
 *
 * Manual usage:
 *   node scripts/optimize-image.mjs public/images/hero/photo.jpg
 */

import sharp from "sharp";
import { stat, unlink, readFile } from "node:fs/promises";
import { extname, basename, dirname, join } from "node:path";
import { execSync } from "node:child_process";

const CONVERTIBLE = new Set([".jpg", ".jpeg", ".png", ".gif", ".tiff"]);
const MAX_WIDTH = 1440;
const QUALITY = 75;

async function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();

  // Skip WebP and SVG — already optimized formats
  if (ext === ".webp" || ext === ".svg") return;

  // Skip anything that isn't a convertible format
  if (!CONVERTIBLE.has(ext)) return;

  const outputPath = join(
    dirname(filePath),
    basename(filePath, ext) + ".webp"
  );

  // Idempotency check: if the WebP output already exists and is newer, skip
  try {
    const [inputStat, outputStat] = await Promise.all([
      stat(filePath),
      stat(outputPath),
    ]);
    if (outputStat.mtimeMs > inputStat.mtimeMs) {
      return;
    }
  } catch {
    // outputPath doesn't exist yet — proceed
  }

  const inputStat = await stat(filePath);

  // Read into a buffer first so sharp releases its file handle before we
  // attempt to delete the original — required on Windows (EBUSY otherwise).
  const inputBuffer = await readFile(filePath);

  await sharp(inputBuffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outputPath);

  const outputStat = await stat(outputPath);

  // Remove the original — file handle is closed because we read via buffer
  await unlink(filePath);

  // Re-stage the output file and un-stage the deleted original so lint-staged
  // commits the WebP rather than reporting an empty commit.
  execSync(`git add "${outputPath}"`);
  execSync(`git rm --cached "${filePath}" 2>/dev/null || true`, { shell: true });

  const inputSize = await formatBytes(inputStat.size);
  const outputSize = await formatBytes(outputStat.size);
  console.log(`✓ optimized: ${filePath} → ${outputPath} (${inputSize} → ${outputSize})`);
}

// lint-staged passes all matched files as separate arguments
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("optimize-image.mjs: no file path provided");
  process.exit(1);
}

for (const file of files) {
  await optimizeImage(file);
}
