/**
 * The fingerprint has to be the real SHA-256, or a claim checked on a
 * phone would disagree with one checked on a desk. Held to the
 * published examples, and to the platform's own implementation.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { fileSize, fingerprint, sha256Hex, shortHash } from './hash.js';

const bytes = (/** @type {string} */ s) => new TextEncoder().encode(s);

test('the published examples', () => {
	assert.equal(
		sha256Hex(bytes('')),
		'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
	);
	assert.equal(
		sha256Hex(bytes('abc')),
		'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
	);
	assert.equal(
		sha256Hex(bytes('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')),
		'248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'
	);
});

test('agrees with the platform at every length around a block edge, and on a large file', () => {
	for (const n of [1, 54, 55, 56, 57, 63, 64, 65, 119, 120, 127, 128, 1000, 300_000]) {
		const data = randomBytes(n);
		assert.equal(sha256Hex(data), createHash('sha256').update(data).digest('hex'), `length ${n}`);
	}
});

test('the browser road and the written-out road give the same fingerprint', async () => {
	const data = randomBytes(5000);
	const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
	assert.equal(await fingerprint(buffer), sha256Hex(data));
});

test('one byte changed is a different file', () => {
	const a = randomBytes(2048);
	const b = Uint8Array.from(a);
	b[1000] ^= 1;
	assert.notEqual(sha256Hex(a), sha256Hex(b));
});

test('a fingerprint and a size read in words', () => {
	const h = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
	assert.equal(shortHash(h), 'ba7816bf…f20015ad');
	assert.equal(shortHash(''), '');
	assert.equal(fileSize(900), '900 bytes');
	assert.equal(fileSize(2048), '2.0 KB');
	assert.equal(fileSize(5 * 1024 * 1024), '5.0 MB');
});
