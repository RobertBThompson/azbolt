#!/usr/bin/env node
/**
 * Generates placeholder PWA icons (192, 512, 512-maskable) for an app.
 * Dependency-free: writes PNGs directly with zlib.
 * Replace these with real artwork before launch.
 *
 * Usage: node gen-icons.js <outDir> <#hexBackground> [#hexMark]
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function crc32(buf) {
	let c,
		table = [];
	for (let n = 0; n < 256; n++) {
		c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	let crc = 0xffffffff;
	for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length);
	const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(body));
	return Buffer.concat([len, body, crc]);
}

function hex(h) {
	const s = h.replace('#', '');
	return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

/** Solid background with a centered square mark; inset leaves maskable safe area. */
function png(size, bg, mark, inset) {
	const [br, bgc, bb] = hex(bg);
	const [mr, mg, mb] = hex(mark);
	const lo = Math.round(size * inset);
	const hi = size - lo;
	const raw = Buffer.alloc(size * (size * 3 + 1));
	let p = 0;
	for (let y = 0; y < size; y++) {
		raw[p++] = 0; // filter: none
		for (let x = 0; x < size; x++) {
			const inMark = x >= lo && x < hi && y >= lo && y < hi;
			raw[p++] = inMark ? mr : br;
			raw[p++] = inMark ? mg : bgc;
			raw[p++] = inMark ? mb : bb;
		}
	}
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(size, 0);
	ihdr.writeUInt32BE(size, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 2; // truecolour
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk('IHDR', ihdr),
		chunk('IDAT', deflateSync(raw, { level: 9 })),
		chunk('IEND', Buffer.alloc(0))
	]);
}

const [outDir, bg = '#17181a', mark = '#b68235'] = process.argv.slice(2);
if (!outDir) {
	console.error('usage: gen-icons.js <outDir> [#bg] [#mark]');
	process.exit(1);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'icon-192.png'), png(192, bg, mark, 0.28));
writeFileSync(join(outDir, 'icon-512.png'), png(512, bg, mark, 0.28));
// Maskable: mark pulled further in so platform masks never clip it.
writeFileSync(join(outDir, 'icon-512-maskable.png'), png(512, bg, mark, 0.34));
console.log(`icons written to ${outDir}`);
