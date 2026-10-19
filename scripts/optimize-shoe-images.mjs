import sharp from "sharp";
import path from "node:path";
import { mkdir, stat } from "node:fs/promises";

const sourceDir = path.resolve("public/images/shoes");
const outputDir = path.resolve(".image-optimization-preview");

const files = [
    "sneaker-white.jpg",
    "formal-dark.jpg",
    "brown-dress.jpg",
    "formal-lifestyle.jpg",
    "formal-pattern.jpg",
    "running-black.jpg",
    "formal-classic.jpg",
];

await mkdir(outputDir, { recursive: true });

const results = [];

for (const name of files) {
    try {
        const input = path.join(sourceDir, name);
        const output = path.join(outputDir, name);
        const original = await stat(input);

        await sharp(input)
            .rotate()
            .resize({
                width: 1600,
                height: 1600,
                fit: "inside",
                withoutEnlargement: true,
            })
            .jpeg({
                quality: 82,
                mozjpeg: true,
                progressive: true,
            })
            .toFile(output);

        const optimized = await stat(output);

        results.push({
            File: name,
            "Before KB": Math.round(original.size / 1024),
            "After KB": Math.round(optimized.size / 1024),
            "Saved %": Math.round(
                (1 - optimized.size / original.size) * 100
            ),
        });
    } catch (error) {
        console.error(`Failed: ${name} — ${error.message}`);
    }
}

console.table(results);

console.log("\nPreview folder:", outputDir);
console.log("Original images were NOT modified.");
