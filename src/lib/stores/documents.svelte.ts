import type { DocumentDetail, DocumentMetadata } from '../types';

class DocumentsStore {
	items = $state<DocumentMetadata[]>([]);
	activeDocument = $state<DocumentDetail | null>(null);
	openTabIds = $state<string[]>([]);
	isLoading = $state<boolean>(false);
	searchQuery = $state<string>('');
	isEditorMode = $state<boolean>(false);
	isSidebarOpen = $state<boolean>(false);
	isSettingsOpen = $state<boolean>(false);
	isUploaderOpen = $state<boolean>(false);
	isTocOpen = $state<boolean>(false);
	isTtsOpen = $state<boolean>(false);

	get filteredItems(): DocumentMetadata[] {
		if (!this.searchQuery.trim()) {
			return this.items;
		}
		const query = this.searchQuery.toLowerCase();
		return this.items.filter((doc) => doc.title.toLowerCase().includes(query));
	}

	get openTabs(): DocumentMetadata[] {
		return this.openTabIds
			.map((id) => this.items.find((doc) => doc.id === id))
			.filter((doc): doc is DocumentMetadata => Boolean(doc));
	}

	openTab(id: string) {
		if (!this.openTabIds.includes(id)) {
			this.openTabIds = [...this.openTabIds, id];
		}
	}

	closeTab(id: string) {
		this.openTabIds = this.openTabIds.filter((tabId) => tabId !== id);
		if (this.activeDocument?.id === id) {
			const nextId = this.openTabIds[this.openTabIds.length - 1];
			if (nextId) {
				this.selectDocument(nextId);
			} else {
				this.activeDocument = null;
			}
		}
	}

	async fetchAll() {
		this.isLoading = true;
		try {
			// Seed sample if needed
			await fetch('/api/documents/sample', { method: 'POST' });

			const response = await fetch('/api/documents');
			const data = await response.json();
			if (data.success) {
				this.items = data.documents;

				// If no active doc is set, select the first document
				if (!this.activeDocument && this.items.length > 0) {
					const lastId = typeof localStorage !== 'undefined' ? localStorage.getItem('neuroread_last_doc_id') : null;
					const targetId = (lastId && this.items.some((d) => d.id === lastId)) ? lastId : this.items[0].id;
					await this.selectDocument(targetId);
				}
			}
		} catch (error) {
			console.error('Failed to fetch documents:', error);
		} finally {
			this.isLoading = false;
		}
	}

	async selectDocument(id: string) {
		this.isLoading = true;
		try {
			const response = await fetch(`/api/documents/${id}`);
			const data = await response.json();
			if (data.success) {
				this.activeDocument = data.document;
				this.openTab(id);
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('neuroread_last_doc_id', id);
				}
			}
		} catch (error) {
			console.error(`Failed to load document ${id}:`, error);
		} finally {
			this.isLoading = false;
		}
	}

	async createNewDocument(title = 'Untitled Note') {
		this.isLoading = true;
		try {
			const initialContent = `# ${title}\n\nStart typing your markdown notes here...`;
			const response = await fetch('/api/documents', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, content: initialContent })
			});
			const data = await response.json();
			if (data.success) {
				await this.fetchAll();
				this.activeDocument = data.document;
				this.openTab(data.document.id);
				this.isEditorMode = true;
			}
		} catch (error) {
			console.error('Failed to create new document:', error);
		} finally {
			this.isLoading = false;
		}
	}

	async updateActiveContent(content: string) {
		if (!this.activeDocument) return;
		try {
			const response = await fetch(`/api/documents/${this.activeDocument.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content })
			});
			const data = await response.json();
			if (data.success) {
				this.activeDocument = data.document;
				await this.fetchAll();
			}
		} catch (error) {
			console.error('Failed to save document edits:', error);
		}
	}

	async deleteDocument(id: string) {
		try {
			const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
			const data = await response.json();
			if (data.success) {
				this.items = this.items.filter((doc) => doc.id !== id);
				this.openTabIds = this.openTabIds.filter((tabId) => tabId !== id);
				if (this.activeDocument?.id === id) {
					if (this.items.length > 0) {
						await this.selectDocument(this.items[0].id);
					} else {
						this.activeDocument = null;
					}
				}
			}
		} catch (error) {
			console.error(`Failed to delete document ${id}:`, error);
		}
	}
}

export const docStore = new DocumentsStore();
