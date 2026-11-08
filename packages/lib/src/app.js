/** Canonical app identifiers, shared so deploy scripts and code agree. */
export const APPS = /** @type {const} */ (['chief', 'chaim', 'lip', 'peace', 'tithe']);

export function appName(slug) {
	return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function appOrigin(slug, base = '155.138.240.74.nip.io') {
	return `https://${slug}.${base}`;
}
