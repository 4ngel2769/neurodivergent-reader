<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import { Save, Eye } from 'lucide-svelte';

	let editContent = $state(docStore.activeDocument?.content || '');
	let isSaving = $state(false);

	$effect(() => {
		if (docStore.activeDocument) {
			editContent = docStore.activeDocument.content;
		}
	});

	async function handleSave() {
		isSaving = true;
		await docStore.updateActiveContent(editContent);
		isSaving = false;
		docStore.isEditorMode = false;
	}

	function handleCancel() {
		docStore.isEditorMode = false;
	}
</script>

<div class="editor-container">
	<header class="editor-header">
		<div class="editor-title">
			<span>Editing: {docStore.activeDocument?.title || 'Document'}</span>
		</div>
		<div class="editor-actions">
			<button class="action-btn cancel-btn" onclick={handleCancel}>
				<Eye size={14} />
				<span>View</span>
			</button>
			<button class="action-btn save-btn" onclick={handleSave} disabled={isSaving}>
				<Save size={14} />
				<span>{isSaving ? 'Saving...' : 'Save'}</span>
			</button>
		</div>
	</header>

	<textarea
		class="editor-textarea"
		bind:value={editContent}
		placeholder="Type your markdown here..."
		aria-label="Markdown editor"
	></textarea>
</div>

<style>
	.editor-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 52px);
		max-width: 960px;
		margin: 0 auto;
		padding: 1rem;
		gap: 0.75rem;
		width: 100%;
	}

	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 0.9rem;
		background: var(--theme-surface, #141414);
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		color: var(--theme-text, #ffffff);
	}

	.editor-title {
		font-weight: 600;
		font-size: 0.88rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.editor-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.7rem;
		border-radius: 3px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.cancel-btn {
		background: transparent;
		border: 1px solid var(--theme-border, #282828);
		color: inherit;
	}

	.cancel-btn:hover {
		background: rgba(128, 128, 128, 0.15);
	}

	.save-btn {
		background: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		border: 1px solid var(--theme-text, #ffffff);
	}

	.save-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.editor-textarea {
		flex: 1;
		width: 100%;
		background: var(--theme-surface, #141414);
		color: var(--theme-text, #ffffff);
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 1.25rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 14px;
		line-height: 1.6;
		resize: none;
		outline: none;
		box-sizing: border-box;
	}

	.editor-textarea:focus {
		border-color: var(--theme-text, #ffffff);
	}
</style>
