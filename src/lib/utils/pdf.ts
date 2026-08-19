import { extractText } from 'unpdf';

/**
 * Removes hyphens from words broken across lines (e.g. "neuro-\ndivergent" -> "neurodivergent").
 */
export function cleanHyphenatedWords(text: string): string {
	return text.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');
}

/**
 * Normalizes repetitive whitespace and carriage returns.
 */
export function normalizeWhitespace(text: string): string {
	return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, '  ');
}

/**
 * Formats bullet points and numbered list items cleanly.
 */
export function normalizeListMarkers(line: string): string {
	const bulletRegex = /^[•●▪■◦*]\s+(.*)/;
	if (bulletRegex.test(line)) {
		return line.replace(bulletRegex, '- $1');
	}
	return line;
}

/**
 * Detects whether a single line looks like a title or section header.
 */
export function isLikelyHeading(line: string, nextLine: string): boolean {
	const trimmed = line.trim();
	if (!trimmed || trimmed.length > 80 || trimmed.endsWith('.') || trimmed.endsWith(',')) {
		return false;
	}

	// Numbered heading like "1. Introduction" or "1.1 Background"
	if (/^(\d+\.)+\s+[A-Z]/.test(trimmed)) {
		return true;
	}

	// ALL CAPS line with more than 3 letters
	if (trimmed.length > 3 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
		return true;
	}

	// Short standalone line followed by a blank or content line
	if (trimmed.length < 50 && /^[A-Z][A-Za-z0-9\s:—–-]+$/.test(trimmed)) {
		return true;
	}

	return false;
}

/**
 * Converts extracted raw text into structured, clean Markdown.
 */
export function formatRawTextToMarkdown(rawText: string, fallbackTitle = 'Imported Document'): string {
	const cleaned = normalizeWhitespace(cleanHyphenatedWords(rawText));
	const lines = cleaned.split('\n');
	const outputLines: string[] = [];

	let titleExtracted = false;

	for (let i = 0; i < lines.length; i++) {
		const currentLine = lines[i].trim();
		const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';

		// Ignore empty lines
		if (!currentLine) {
			if (outputLines.length > 0 && outputLines[outputLines.length - 1] !== '') {
				outputLines.push('');
			}
			continue;
		}

		// Filter out page numbers or footer lines like "Page 1 of 10" or "— 1 —"
		if (/^(page\s+\d+(\s+of\s+\d+)?|\d+|\s*—\s*\d+\s*—\s*)$/i.test(currentLine)) {
			continue;
		}

		// Document Title
		if (!titleExtracted && currentLine.length < 90 && !currentLine.startsWith('#')) {
			outputLines.push(`# ${currentLine}`);
			outputLines.push('');
			titleExtracted = true;
			continue;
		}

		// Section Headings
		if (isLikelyHeading(currentLine, nextLine)) {
			outputLines.push('');
			outputLines.push(`## ${currentLine.replace(/^#+\s*/, '')}`);
			outputLines.push('');
			continue;
		}

		// Normalized list item
		const normalizedLine = normalizeListMarkers(currentLine);
		outputLines.push(normalizedLine);
	}

	if (!titleExtracted) {
		outputLines.unshift('', '');
		outputLines.unshift(`# ${fallbackTitle}`);
	}

	return outputLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Extracts text from a PDF buffer and returns clean Markdown.
 */
export async function convertPdfToMarkdown(
	pdfBuffer: ArrayBuffer | Uint8Array,
	fallbackTitle = 'PDF Document'
): Promise<string> {
	const result = await extractText(new Uint8Array(pdfBuffer), { mergePages: true });
	const rawText =
		typeof result.text === 'string'
			? result.text
			: Array.isArray(result.text)
				? (result.text as string[]).join('\n\n')
				: '';
	return formatRawTextToMarkdown(rawText, fallbackTitle);
}
