import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteDocumentById, getDocumentById, saveDocument } from '$lib/utils/storage';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const doc = await getDocumentById(params.id);
		if (!doc) {
			return json({ success: false, error: 'Document not found' }, { status: 404 });
		}
		return json({ success: true, document: doc });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to get document';
		return json({ success: false, error: message }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const { content, title } = body;

		if (typeof content !== 'string') {
			return json({ success: false, error: 'Content must be a string' }, { status: 400 });
		}

		const updatedDoc = await saveDocument(params.id, content, title);
		return json({ success: true, document: updatedDoc });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update document';
		return json({ success: false, error: message }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const deleted = await deleteDocumentById(params.id);
		if (!deleted) {
			return json({ success: false, error: 'Failed to delete document' }, { status: 404 });
		}
		return json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to delete document';
		return json({ success: false, error: message }, { status: 500 });
	}
};
