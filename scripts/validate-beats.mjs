#!/usr/bin/env node
/**
 * 校验阿玲口播 beats.json
 * Usage: node validate-beats.mjs <beats.json>
 */
import { readFile } from 'node:fs/promises';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node validate-beats.mjs <beats.json>');
  process.exit(1);
}

const KINDS = new Set(['metric', 'list', 'steps', 'compare', 'quote']);
const ACCENTS = new Set(['coral', 'ink', 'sand', 'teal']);
const errors = [];

function num(n, label) {
  if (typeof n !== 'number' || Number.isNaN(n) || n < 0) errors.push(`${label} must be a non-negative number`);
}

const raw = await readFile(file, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error(`Invalid JSON: ${e.message}`);
  process.exit(1);
}

if (!data.video || typeof data.video !== 'object') errors.push('video object required');
else {
  for (const k of ['eyebrow', 'title', 'subtitle']) {
    if (typeof data.video[k] !== 'string' || !data.video[k].trim()) errors.push(`video.${k} required`);
  }
  num(data.video.duration, 'video.duration');
  if (typeof data.video.applyGrade !== 'boolean') errors.push('video.applyGrade must be boolean');
}

if (!Array.isArray(data.subs) || data.subs.length === 0) errors.push('subs must be a non-empty array');
else {
  data.subs.forEach((s, i) => {
    num(s.start, `subs[${i}].start`);
    num(s.end, `subs[${i}].end`);
    if (!(s.end > s.start)) errors.push(`subs[${i}] end must be > start`);
    if (typeof s.cn !== 'string' || !s.cn.trim()) errors.push(`subs[${i}].cn required`);
    if (typeof s.en !== 'string') errors.push(`subs[${i}].en must be string`);
  });
}

if (!Array.isArray(data.chapters) || data.chapters.length < 2) errors.push('chapters need at least 2 items');
else {
  data.chapters.forEach((c, i) => {
    num(c.start, `chapters[${i}].start`);
    num(c.end, `chapters[${i}].end`);
    if (!(c.end > c.start)) errors.push(`chapters[${i}] end must be > start`);
    if (typeof c.label !== 'string' || !c.label.trim()) errors.push(`chapters[${i}].label required`);
  });
}

if (!Array.isArray(data.cards)) errors.push('cards must be an array');
else {
  data.cards.forEach((c, i) => {
    num(c.start, `cards[${i}].start`);
    num(c.end, `cards[${i}].end`);
    if (!(c.end > c.start)) errors.push(`cards[${i}] end must be > start`);
    if (c.end - c.start < 1.8) errors.push(`cards[${i}] should stay visible ≥ 1.8s`);
    if (!KINDS.has(c.kind)) errors.push(`cards[${i}].kind invalid`);
    if (c.accent && !ACCENTS.has(c.accent)) errors.push(`cards[${i}].accent invalid`);
    if (c.kind === 'list' || c.kind === 'steps') {
      if (!Array.isArray(c.items) || c.items.length < 2) errors.push(`cards[${i}].items need ≥ 2`);
    }
    if (c.kind === 'compare') {
      if (!c.left?.label || !c.right?.label) errors.push(`cards[${i}] compare needs left/right`);
    }
    if (c.kind === 'metric' && typeof c.value !== 'string') errors.push(`cards[${i}].value required for metric`);
  });
}

if (data.sfx != null && !Array.isArray(data.sfx)) errors.push('sfx must be an array when present');

const duration = data.video?.duration;
if (typeof duration === 'number') {
  const lastSub = data.subs?.[data.subs.length - 1];
  if (lastSub && lastSub.end > duration + 0.05) errors.push('last subtitle ends after video.duration');
}

if (errors.length) {
  console.error('beats.json validation failed:');
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, subs: data.subs.length, chapters: data.chapters.length, cards: data.cards.length }, null, 2));
