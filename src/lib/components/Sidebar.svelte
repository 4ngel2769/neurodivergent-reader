<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import {
		BookOpen,
		Upload,
		Plus,
		Search,
		Trash2,
		Download,
		X,
		FileText,
		Clock
	} from 'lucide-svelte';

	function handleSelectDoc(id: string) {
		docStore.selectDocument(id);
		docStore.isSidebarOpen = false;
	}

	function handleOpenUploader() {
		docStore.isSidebarOpen = false;
		docStore.isUploaderOpen = true;
	}

	function handleCreateNote() {
		docStore.isSidebarOpen = false;
		docStore.createNewDocument();
	}

	function handleDelete(e: MouseEvent, id: string, title: string) {
		e.stopPropagation();
		if (confirm(`Are you sure you want to delete "${title}"?`)) {
			docStore.deleteDocument(id);
		}
	}

	function handleDownload(e: MouseEvent, id: string, filename: string) {
		e.stopPropagation();
		const doc = docStore.items.find((d) => d.id === id);
		if (!doc) return;

		fetch(`/api/documents/${id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					const blob = new Blob([data.document.content], { type: 'text/markdown;charset=utf-8' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `${doc.id}.md`;
					a.click();
					URL.revokeObjectURL(url);
				}
			});
	}
</script>

{#if docStore.isSidebarOpen}
	<div
		class="sidebar-backdrop"
		onclick={() => (docStore.isSidebarOpen = false)}
		aria-hidden="true"
	></div>
	<aside class="sidebar-drawer" aria-label="Document library">
		<header class="sidebar-header">
			<div class="header-brand">
				<BookOpen size={17} />
				<span class="brand-title">Library</span>
			</div>
			<button
				class="close-btn"
				onclick={() => (docStore.isSidebarOpen = false)}
				aria-label="Close library sidebar"
			>
				<X size={16} />
			</button>
		</header>

		<div class="sidebar-actions">
			<button class="action-btn upload-btn" onclick={handleOpenUploader}>
				<Upload size={14} />
				<span>Upload File</span>
			</button>
			<button class="action-btn new-btn" onclick={handleCreateNote}>
				<Plus size={14} />
				<span>New Note</span>
			</button>
		</div>

		<div class="search-box">
			<Search size={14} class="search-icon" />
			<input
				type="text"
				placeholder="Search documents..."
				bind:value={docStore.searchQuery}
				class="search-input"
				aria-label="Search documents"
			/>
			{#if docStore.searchQuery}
				<button class="clear-search-btn" onclick={() => (docStore.searchQuery = '')}>
					<X size={12} />
				</button>
			{/if}
		</div>

		<div class="documents-list">
			{#if docStore.isLoading && docStore.items.length === 0}
				<p class="empty-msg">Loading...</p>
			{:else if docStore.filteredItems.length === 0}
				<p class="empty-msg">No documents found.</p>
			{:else}
				{#each docStore.filteredItems as doc (doc.id)}
					<div
						class="doc-card"
						class:active={docStore.activeDocument?.id === doc.id}
						onclick={() => handleSelectDoc(doc.id)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && handleSelectDoc(doc.id)}
					>
						<div class="doc-main">
							<FileText size={16} class="doc-icon" />
							<div class="doc-details">
								<h3 class="doc-title">{doc.title}</h3>
								<div class="doc-meta">
									<span>{doc.wordCount} words</span>
									<span>•</span>
									<span class="reading-time">
										<Clock size={11} />
										{doc.readingTimeMinutes} min
									</span>
								</div>
							</div>
						</div>

						<div class="doc-actions">
							<button
								class="doc-action-btn"
								onclick={(e) => handleDownload(e, doc.id, doc.filename)}
								title="Download Markdown"
								aria-label="Download Markdown"
							>
								<Download size={13} />
							</button>
							<button
								class="doc-action-btn delete-btn"
								onclick={(e) => handleDelete(e, doc.id, doc.title)}
								title="Delete document"
								aria-label="Delete document"
							>
								<Trash2 size={13} />
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</aside>
{/if}

<style>
	.sidebar-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 60;
	}

	.sidebar-drawer {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 320px;
		max-width: 85vw;
		background: var(--theme-surface, #141414);
		border-right: 1px solid var(--theme-border, #282828);
		color: var(--theme-text, #ffffff);
		z-index: 65;
		display: flex;
		flex-direction: column;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1rem 0.75rem;
		border-bottom: 1px solid var(--theme-border, #282828);
	}

	.header-brand {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.brand-title {
		font-weight: 700;
		font-size: 0.95rem;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0.2rem;
		border-radius: 3px;
		display: flex;
		opacity: 0.7;
	}

	.close-btn:hover {
		opacity: 1;
		background: rgba(128, 128, 128, 0.15);
	}

	.sidebar-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		padding: 0.75rem 1rem 0.5rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.45rem;
		border-radius: 4px;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.upload-btn {
		background: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		border: 1px solid var(--theme-text, #ffffff);
	}

	.upload-btn:hover {
		opacity: 0.9;
	}

	.new-btn {
		background: transparent;
		color: inherit;
		border: 1px solid var(--theme-border, #282828);
	}

	.new-btn:hover {
		background: rgba(128, 128, 128, 0.15);
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0.4rem 1rem 0.75rem;
		padding: 0.35rem 0.6rem;
		background: rgba(128, 128, 128, 0.08);
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
	}

	.search-input {
		background: transparent;
		border: none;
		outline: none;
		color: inherit;
		font-size: 0.8rem;
		width: 100%;
	}

	.clear-search-btn {
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0;
		display: flex;
		opacity: 0.6;
	}

	.clear-search-btn:hover {
		opacity: 1;
	}

	.documents-list {
		flex: 1;
		overflow-y: auto;
		padding: 0 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.empty-msg {
		text-align: center;
		opacity: 0.6;
		font-size: 0.8rem;
		margin-top: 1.5rem;
	}

	.doc-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 0.7rem;
		border-radius: 4px;
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.doc-card:hover {
		background: rgba(128, 128, 128, 0.08);
	}

	.doc-card.active {
		background: rgba(128, 128, 128, 0.14);
		border-color: var(--theme-border, #282828);
	}

	.doc-main {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	:global(.doc-icon) {
		opacity: 0.7;
		margin-top: 0.1rem;
		flex-shrink: 0;
	}

	.doc-details {
		flex: 1;
		min-width: 0;
	}

	.doc-title {
		font-size: 0.82rem;
		font-weight: 600;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.doc-meta {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		opacity: 0.6;
		margin-top: 0.15rem;
	}

	.reading-time {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.doc-actions {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		margin-left: 0.4rem;
	}

	.doc-action-btn {
		background: transparent;
		border: none;
		color: inherit;
		padding: 0.25rem;
		border-radius: 3px;
		cursor: pointer;
		opacity: 0.5;
		display: flex;
		transition: all 0.12s ease;
	}

	.doc-action-btn:hover {
		opacity: 1;
		background: rgba(128, 128, 128, 0.15);
	}

	.delete-btn:hover {
		opacity: 1;
	}
</style>
