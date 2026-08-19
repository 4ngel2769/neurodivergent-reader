import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listAllDocuments, saveDocument } from '$lib/utils/storage';

export const GET: RequestHandler = async () => {
	try {
		const documents = await listAllDocuments();
		return json({ success: true, documents });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to list documents';
		return json({ success: false, error: message }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { id, title, content } = body;

		if (!content && content !== '') {
			return json({ success: false, error: 'Document content is required' }, { status: 400 });
		}

		const doc = await saveDocument(id, content, title);
		return json({ success: true, document: doc });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create document';
		return json({ success: false, error: message }, { status: 500 });
	}
};
