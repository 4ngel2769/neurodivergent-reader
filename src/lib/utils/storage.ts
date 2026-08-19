import { promises as fs } from 'fs';
import path from 'path';
import type { DocumentDetail, DocumentMetadata } from '../types';

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');

export function getDataDirectory(): string {
	return DATA_DIR;
}

export async function ensureDataDirectory(): Promise<void> {
	try {
		await fs.mkdir(DATA_DIR, { recursive: true });
	} catch (error) {
		console.error('Failed to create data directory:', error);
	}
}

export function slugifyTitle(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 50) || 'document';
}

export function extractDocumentTitle(content: string, fallback: string): string {
	const headingMatch = content.match(/^#\s+(.+)$/m);
	if (headingMatch && headingMatch[1].trim()) {
		return headingMatch[1].trim();
	}
	return fallback;
}

export function calculateWordCount(content: string): number {
	const textOnly = content.replace(/[#*`_~[\]()]/g, ' ');
	const words = textOnly.trim().split(/\s+/).filter(Boolean);
	return words.length;
}

export function calculateReadingTime(wordCount: number): number {
	// Average reading speed for comfortable neurodivergent reading ~ 180 wpm
	return Math.max(1, Math.ceil(wordCount / 180));
}

export function getFilePath(id: string): string {
	const safeId = path.basename(id).replace(/\.md$/, '');
	return path.join(DATA_DIR, `${safeId}.md`);
}

export async function getDocumentById(id: string): Promise<DocumentDetail | null> {
	await ensureDataDirectory();
	const filePath = getFilePath(id);

	try {
		const stat = await fs.stat(filePath);
		const content = await fs.readFile(filePath, 'utf-8');
		const safeId = path.basename(id).replace(/\.md$/, '');
		const title = extractDocumentTitle(content, safeId.replace(/-/g, ' '));
		const wordCount = calculateWordCount(content);

		return {
			id: safeId,
			title,
			filename: `${safeId}.md`,
			sizeBytes: stat.size,
			wordCount,
			readingTimeMinutes: calculateReadingTime(wordCount),
			createdAt: stat.birthtime.toISOString(),
			updatedAt: stat.mtime.toISOString(),
			content
		};
	} catch {
		return null;
	}
}

export async function listAllDocuments(): Promise<DocumentMetadata[]> {
	await ensureDataDirectory();
	try {
		const files = await fs.readdir(DATA_DIR);
		const mdFiles = files.filter((file: string) => file.endsWith('.md'));

		const docs: DocumentMetadata[] = [];
		for (const file of mdFiles) {
			const safeId = file.replace(/\.md$/, '');
			const doc = await getDocumentById(safeId);
			if (doc) {
				const { content, ...metadata } = doc;
				docs.push(metadata);
			}
		}

		// Sort by most recently updated
		return docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
	} catch (error) {
		console.error('Failed to list documents:', error);
		return [];
	}
}

export async function saveDocument(
	id: string,
	content: string,
	customTitle?: string
): Promise<DocumentDetail> {
	await ensureDataDirectory();
	const safeId = slugifyTitle(id || customTitle || 'note');
	const uniqueId = id || `${safeId}-${Date.now().toString().slice(-4)}`;
	const filePath = getFilePath(uniqueId);

	await fs.writeFile(filePath, content, 'utf-8');
	const savedDoc = await getDocumentById(uniqueId);
	if (!savedDoc) {
		throw new Error('Failed to retrieve document after saving.');
	}
	return savedDoc;
}

export async function deleteDocumentById(id: string): Promise<boolean> {
	await ensureDataDirectory();
	const filePath = getFilePath(id);
	try {
		await fs.unlink(filePath);
		return true;
	} catch {
		return false;
	}
}
