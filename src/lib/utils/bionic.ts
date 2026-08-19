/**
 * Applies bionic reading formatting to a single word.
 */
export function formatBionicWord(word: string, fixationFactor = 0.5): string {
	// Match leading non-alpha, alphabetic core, and trailing non-alpha
	const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
	if (!match) {
		return word;
	}

	const [, prefix, core, suffix] = match;
	const length = core.length;

	if (length === 0) return word;

	let boldCount = Math.ceil(length * fixationFactor);
	if (length === 1) boldCount = 1;
	if (length === 2) boldCount = 1;
	if (length === 3) boldCount = 2;
	if (length === 4) boldCount = 2;

	const boldPart = core.slice(0, boldCount);
	const restPart = core.slice(boldCount);

	return `${prefix}<b>${boldPart}</b>${restPart}${suffix}`;
}

/**
 * Applies bionic reading to a plain text string.
 */
export function applyBionicToText(text: string, fixationFactor = 0.5): string {
	return text
		.split(/(\s+)/)
		.map((token) => {
			if (/^\s+$/.test(token) || !token) return token;
			return formatBionicWord(token, fixationFactor);
		})
		.join('');
}

/**
 * Transforms an HTML string with bionic reading, skipping tags and code blocks.
 */
export function applyBionicToHtml(html: string, fixationFactor = 0.5): string {
	if (!html) return '';

	// Split by tags and code blocks
	const tokenRegex = /(<code[\s\S]*?<\/code>|<pre[\s\S]*?<\/pre>|<[^>]+>)/gi;
	const parts = html.split(tokenRegex);

	return parts
		.map((part) => {
			if (!part) return '';
			// If it is an HTML tag or code block, preserve it as-is
			if (part.startsWith('<') && part.endsWith('>')) {
				return part;
			}
			// Otherwise, apply bionic reading to the text content
			return applyBionicToText(part, fixationFactor);
		})
		.join('');
}
