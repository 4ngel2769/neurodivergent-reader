import type { DocumentDetail } from '../types';

export interface UploadResult {
	success: boolean;
	document?: DocumentDetail;
	error?: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
	const formData = new FormData();
	formData.append('file', file);

	try {
		const response = await fetch('/api/documents/upload', {
			method: 'POST',
			body: formData
		});

		const data = await response.json();
		if (!response.ok || !data.success) {
			return { success: false, error: data.error || 'Failed to upload and convert file.' };
		}

		return { success: true, document: data.document };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Upload failed';
		return { success: false, error: message };
	}
}
