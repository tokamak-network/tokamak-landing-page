#!/usr/bin/env node
/**
 * Slice the isometric cube illustration into individual cell textures.
 *
 * The source image (1200×1200) shows a Rubik's cube in isometric view with
 * three visible faces: top, front (bottom-left face), and right (bottom-right face).
 *
 * Each face has a 3×3 grid of illustrated cells. We approximate the center of
 * each cell and extract a square crop around it, then resize to 256×256.
 *
 * Hidden faces (bottom, back, left) reuse the visible face textures.
 */

import sharp from "sharp";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "public/cube/source.jpg");
const OUT = resolve(ROOT, "public/cube/textures");

mkdirSync(OUT, { recursive: true });

// Cell size for cropping (approximate square region around each cell center)
const CROP = 110;
const OUT_SIZE = 256;

/**
 * Cell center coordinates mapped from the isometric illustration.
 * Coordinates are (x, y) in the 1200×1200 source image.
 *
 * TOP face - the face visible from above
 * Rows go from back to front (top of image to middle)
 * Cols go from left to right
 */
const TOP_CELLS = [
  // Row 0 (back row, nearest top of image)
  [
    { x: 370, y: 165 }, // top-0-0 (left-back) - lightbulb/idea
    { x: 510, y: 110 }, // top-0-1 (center-back) - person standing
    { x: 650, y: 165 }, // top-0-2 (right-back) - scrolls/writing
  ],
  // Row 1 (middle row)
  [
    { x: 300, y: 250 }, // top-1-0 - mountains/landscape
    { x: 450, y: 195 }, // top-1-1 - whirlpool/portal
    { x: 600, y: 245 }, // top-1-2 - candle/burger
  ],
  // Row 2 (front row, nearest camera)
  [
    { x: 235, y: 335 }, // top-2-0 - library/buildings
    { x: 380, y: 280 }, // top-2-1 - red room/meeting
    { x: 530, y: 330 }, // top-2-2 - people/social
  ],
];

/**
 * FRONT face - the bottom-left visible face
 * Rows go from top to bottom
 * Cols go from left to right
 */
const FRONT_CELLS = [
  // Row 0 (top row of front face)
  [
    { x: 230, y: 430 }, // front-0-0 - flying birds
    { x: 375, y: 380 }, // front-0-1 - underwater/sky scene
    { x: 520, y: 430 }, // front-0-2 - green jungle
  ],
  // Row 1 (middle row)
  [
    { x: 225, y: 570 }, // front-1-0 - surfer
    { x: 375, y: 520 }, // front-1-1 - clouds
    { x: 520, y: 570 }, // front-1-2 - tropical plants
  ],
  // Row 2 (bottom row)
  [
    { x: 225, y: 715 }, // front-2-0 - chart/graph
    { x: 375, y: 665 }, // front-2-1 - red/orange scene
    { x: 520, y: 715 }, // front-2-2 - pillows/bedroom
  ],
];

/**
 * RIGHT face - the bottom-right visible face
 * Rows go from top to bottom
 * Cols go from left to right (left = near front edge, right = far edge)
 */
const RIGHT_CELLS = [
  // Row 0 (top row of right face)
  [
    { x: 625, y: 430 }, // right-0-0 - people talking
    { x: 770, y: 380 }, // right-0-1 - stars/space
    { x: 900, y: 430 }, // right-0-2 - music/signal
  ],
  // Row 1 (middle row)
  [
    { x: 625, y: 570 }, // right-1-0 - jungle/green
    { x: 770, y: 520 }, // right-1-1 - dark space
    { x: 900, y: 570 }, // right-1-2 - signal waves
  ],
  // Row 2 (bottom row)
  [
    { x: 625, y: 715 }, // right-2-0 - plants/nature
    { x: 770, y: 665 }, // right-2-1 - pencil/drawing
    { x: 900, y: 715 }, // right-2-2 - books/reading
  ],
];

const faces = {
  top: TOP_CELLS,
  front: FRONT_CELLS,
  right: RIGHT_CELLS,
};

// Mirror mapping for hidden faces
const MIRROR = {
  bottom: "top",
  back: "front",
  left: "right",
};

async function sliceFace(faceName, cells) {
  const tasks = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const { x, y } = cells[row][col];
      const left = Math.max(0, Math.round(x - CROP / 2));
      const top = Math.max(0, Math.round(y - CROP / 2));
      // Clamp to image bounds
      const width = Math.min(CROP, 1200 - left);
      const height = Math.min(CROP, 1200 - top);
      const outPath = resolve(OUT, `${faceName}-${row}-${col}.png`);
      tasks.push(
        sharp(SRC)
          .extract({ left, top, width, height })
          .resize(OUT_SIZE, OUT_SIZE, { fit: "cover" })
          .png()
          .toFile(outPath)
          .then(() => console.log(`  ✓ ${faceName}-${row}-${col}`))
      );
    }
  }
  return Promise.all(tasks);
}

async function copyMirror(hiddenFace, visibleFace) {
  const tasks = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const srcPath = resolve(OUT, `${visibleFace}-${row}-${col}.png`);
      const dstPath = resolve(OUT, `${hiddenFace}-${row}-${col}.png`);
      tasks.push(
        sharp(srcPath)
          .png()
          .toFile(dstPath)
          .then(() => console.log(`  ✓ ${hiddenFace}-${row}-${col} (from ${visibleFace})`))
      );
    }
  }
  return Promise.all(tasks);
}

async function main() {
  console.log("Slicing cube textures from source image...\n");

  // Extract visible faces
  for (const [name, cells] of Object.entries(faces)) {
    console.log(`Extracting ${name} face:`);
    await sliceFace(name, cells);
    console.log();
  }

  // Copy to hidden faces
  for (const [hidden, visible] of Object.entries(MIRROR)) {
    console.log(`Mirroring ${visible} → ${hidden}:`);
    await copyMirror(hidden, visible);
    console.log();
  }

  console.log("Done! 54 textures generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
