// Generates short silent WAV files as placeholder episode audio.
// Usage: node scripts/generate-placeholder-audio.mjs
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const audioDir = join(root, "public", "audio");
mkdirSync(audioDir, { recursive: true });

function silentWav({ sampleRate = 8000, seconds = 1 } = {}) {
  const numSamples = sampleRate * seconds;
  const dataSize = numSamples * 2; // 16-bit mono
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  // samples already zeroed = silence
  return buffer;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Pass one or more output filenames, e.g. ep-001.wav");
  process.exit(1);
}

for (const name of files) {
  const out = join(audioDir, name);
  if (existsSync(out)) {
    console.log(`exists, skipped: public/audio/${name}`);
    continue;
  }
  writeFileSync(out, silentWav());
  console.log(`wrote: public/audio/${name}`);
}
