/**
 * A file's fingerprint: its SHA-256 hash, as 64 hex characters.
 *
 * Two files with the same fingerprint are the same file, and one byte
 * changed gives a different one. That is what lets a claim point at a
 * file kept somewhere else and still say whether it has been altered.
 *
 * The browser's own implementation is used when it is there. It is
 * only there on a secure page — https, or this machine — and Chief is
 * also opened from a phone over the local network while it is being
 * built, so the same sum is written out here to fall back on. The two
 * agree, and the tests hold them to the published examples.
 */

const K = new Uint32Array([
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

/** @param {number} x @param {number} n */
const rotr = (x, n) => (x >>> n) | (x << (32 - n));

/**
 * SHA-256, written out. Used when the browser's is not available.
 * @param {Uint8Array} bytes
 * @returns {string} 64 lowercase hex characters
 */
export function sha256Hex(bytes) {
	const h = new Uint32Array([
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	]);
	const length = bytes.length;
	// The message, a 1 bit, zeros, then its length in bits as 64 bits.
	const padded = new Uint8Array((((length + 8) >> 6) + 1) << 6);
	padded.set(bytes);
	padded[length] = 0x80;
	const view = new DataView(padded.buffer);
	view.setUint32(padded.length - 8, Math.floor(length / 0x20000000));
	view.setUint32(padded.length - 4, (length << 3) >>> 0);

	const w = new Uint32Array(64);
	for (let at = 0; at < padded.length; at += 64) {
		for (let i = 0; i < 16; i++) w[i] = view.getUint32(at + i * 4);
		for (let i = 16; i < 64; i++) {
			const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
			const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
			w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
		}
		let [a, b, c, d, e, f, g, hh] = h;
		for (let i = 0; i < 64; i++) {
			const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
			const ch = (e & f) ^ (~e & g);
			const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
			const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const t2 = (S0 + maj) >>> 0;
			hh = g;
			g = f;
			f = e;
			e = (d + t1) >>> 0;
			d = c;
			c = b;
			b = a;
			a = (t1 + t2) >>> 0;
		}
		h[0] += a;
		h[1] += b;
		h[2] += c;
		h[3] += d;
		h[4] += e;
		h[5] += f;
		h[6] += g;
		h[7] += hh;
	}
	return [...h].map((x) => x.toString(16).padStart(8, '0')).join('');
}

/**
 * The fingerprint of some bytes, by the browser when it can.
 * @param {ArrayBuffer} buffer
 * @returns {Promise<string>}
 */
export async function fingerprint(buffer) {
	const subtle = globalThis.crypto?.subtle;
	if (subtle) {
		const digest = new Uint8Array(await subtle.digest('SHA-256', buffer));
		return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
	}
	return sha256Hex(new Uint8Array(buffer));
}

/**
 * A fingerprint as a person can compare it: the first and last eight
 * characters. Enough to tell two apart at a glance; the whole of it
 * is one tap away.
 * @param {string} hash
 */
export const shortHash = (hash) => (hash ? `${hash.slice(0, 8)}…${hash.slice(-8)}` : '');

/** @param {number} bytes */
export function fileSize(bytes) {
	if (bytes < 1024) return `${bytes} bytes`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
