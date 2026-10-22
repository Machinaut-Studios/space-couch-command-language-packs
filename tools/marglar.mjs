#!/usr/bin/env node
// Builds the Marglar joke pack from the game's exported English template.
//
//   node tools/marglar.mjs <path to _english-template> [out folder]
//
// Roughly one word in four becomes "Marglar", matched to the word's case (MARGLAR, Marglar, marglar).
// The choice is seeded by each entry's Text Key, so running it again on the same template gives the same pack.
// Parameters such as {count} are never touched, and an entry never grows past its "Max N characters" note
// (or 1.3 times the English, for hail lines).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [templateDir, outArg] = process.argv.slice(2);
if (!templateDir) {
  console.error("usage: node tools/marglar.mjs <path to _english-template> [out folder]");
  process.exit(1);
}
const outDir = outArg ?? path.join(path.dirname(new URL(import.meta.url).pathname), "..", "packs", "marglar");

const RATE = 0.25;
const WORD = /[A-Za-z][A-Za-z']*/g;
// Words a player has to read to operate the game stay as they are.
const KEEP = new Set(["ESC", "ENTER", "SPACE", "TAB", "OK"]);

// FNV-1a over the key, then a small xorshift stream: stable "random" choices per entry.
function rng(seedText) {
  let h = 0x811c9dc5;
  for (const ch of seedText) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  let x = h || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 0x100000000;
  };
}

function marglarFor(word) {
  if (word === word.toUpperCase() && word.length > 1) return "MARGLAR";
  if (word[0] === word[0].toUpperCase()) return "Marglar";
  return "marglar";
}

function marglarize(text, key, max) {
  // Hail lines (radio dialogue) should stay within 1.3 times the English length.
  if (key.startsWith("hail.")) max = Math.min(max ?? Infinity, Math.floor(text.length * 1.3));
  // Split around {params} so they are never matched as words.
  const parts = text.split(/(\{[^}]*\})/);
  const words = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) return;
    for (const m of part.matchAll(WORD)) {
      if (m[0].length >= 3 && !KEEP.has(m[0])) words.push({ part: i, index: m.index, word: m[0] });
    }
  });
  if (!words.length) return text;
  const next = rng(key);
  let picked = words.filter(() => next() < RATE);
  if (!picked.length) return text;

  const build = (chosen) => {
    const byPart = new Map();
    for (const w of chosen) byPart.set(w.part, [...(byPart.get(w.part) ?? []), w]);
    return parts
      .map((part, i) => {
        const hits = (byPart.get(i) ?? []).sort((a, b) => b.index - a.index);
        let out = part;
        for (const w of hits) out = out.slice(0, w.index) + marglarFor(w.word) + out.slice(w.index + w.word.length);
        return out;
      })
      .join("");
  };
  // Drop replacements, last first, until the entry fits its limit again.
  let out = build(picked);
  while (max && out.length > max && picked.length) {
    picked = picked.slice(0, -1);
    out = build(picked);
  }
  return out;
}

const maxFrom = (note) => {
  const m = typeof note === "string" && note.match(/Max (\d+) characters/);
  return m ? Number(m[1]) : undefined;
};

const PLURAL_FORMS = new Set(["zero", "one", "two", "few", "many", "other"]);
const isPlural = (v) =>
  v && typeof v === "object" && typeof v.other === "string" &&
  Object.entries(v).every(([k, t]) => k.startsWith("_") || (PLURAL_FORMS.has(k) && typeof t === "string"));

let entries = 0;
function walk(node, prefix) {
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("_")) continue; // translator notes are not part of the pack
    const key = prefix ? `${prefix}.${k}` : k;
    const max = maxFrom(node[`_${k}`]);
    if (typeof v === "string") {
      out[k] = marglarize(v, key, max);
      entries++;
    } else if (isPlural(v)) {
      out[k] = {};
      for (const [form, text] of Object.entries(v)) {
        if (form.startsWith("_")) continue;
        // Same seed for every form, so "1 PROBLEM" and "3 PROBLEMS" swap the same word.
        out[k][form] = marglarize(text, key, max ?? maxFrom(v[`_${form}`]));
      }
      entries++;
    } else if (v && typeof v === "object") {
      out[k] = walk(v, key);
    }
  }
  return out;
}

const english = JSON.parse(readFileSync(path.join(templateDir, "en.json"), "utf8"));
const template = JSON.parse(readFileSync(path.join(templateDir, "pack.template.json"), "utf8"));
const texts = walk(english, "");

mkdirSync(outDir, { recursive: true });
const manifest = {
  id: "marglar",
  language: "en",
  name: "Marglar",
  version: "1.0.0",
  author: "Space Couch Command",
  sourceHashes: template.sourceHashes,
};
writeFileSync(path.join(outDir, "pack.json"), JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(path.join(outDir, "marglar.json"), JSON.stringify(texts, null, 2) + "\n");
console.log(`Marglar pack: ${entries} entries written to ${outDir}`);
