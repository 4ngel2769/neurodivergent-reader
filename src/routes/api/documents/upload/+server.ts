import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { convertPdfToMarkdown } from '$lib/utils/pdf';
import { saveDocument, slugifyTitle } from '$lib/utils/storage';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			return json({ success: false, error: 'No file provided' }, { status: 400 });
		}

		const originalName = file.name || 'document';
		const baseName = originalName.replace(/\.[^/.]+$/, '');
		const isPdf = originalName.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
		const isMarkdown = originalName.toLowerCase().endsWith('.md');
		const isText = originalName.toLowerCase().endsWith('.txt') || file.type.startsWith('text/');

		if (!isPdf && !isMarkdown && !isText) {
			return json(
				{ success: false, error: 'Unsupported file type. Please upload a PDF, MD, or TXT file.' },
				{ status: 400 }
			);
		}

		let markdownContent = '';
		const arrayBuffer = await file.arrayBuffer();

		if (isPdf) {
			markdownContent = await convertPdfToMarkdown(arrayBuffer, baseName);
		} else {
			const decoder = new TextDecoder('utf-8');
			markdownContent = decoder.decode(arrayBuffer);
		}

		const docId = slugifyTitle(baseName);
		const savedDoc = await saveDocument(docId, markdownContent, baseName);

		return json({
			success: true,
			document: savedDoc,
			originalName
		});
	} catch (error) {
		console.error('File upload conversion error:', error);
		const message = error instanceof Error ? error.message : 'Failed to process and convert file';
		return json({ success: false, error: message }, { status: 500 });
	}
};
