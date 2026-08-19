<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import { Upload, X, Check, AlertCircle, Loader2 } from 'lucide-svelte';

	let isDragging = $state(false);
	let isUploading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let fileInputRef: HTMLInputElement | null = $state(null);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			processUpload(e.dataTransfer.files[0]);
		}
	}

	function handleFileSelected(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			processUpload(target.files[0]);
		}
	}

	async function processUpload(file: File) {
		errorMessage = '';
		successMessage = '';
		isUploading = true;

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/documents/upload', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();
			if (!response.ok || !data.success) {
				throw new Error(data.error || 'Failed to upload and convert file.');
			}

			successMessage = `Saved: ${data.document.title}`;
			await docStore.fetchAll();
			await docStore.selectDocument(data.document.id);

			setTimeout(() => {
				docStore.isUploaderOpen = false;
				successMessage = '';
				isUploading = false;
			}, 700);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Upload failed';
			isUploading = false;
		}
	}
</script>

{#if docStore.isUploaderOpen}
	<div
		class="uploader-backdrop"
		onclick={() => (docStore.isUploaderOpen = false)}
		aria-hidden="true"
	></div>
	<div class="uploader-modal" role="dialog" aria-modal="true" aria-labelledby="uploader-title">
		<header class="modal-header">
			<h2 id="uploader-title" class="modal-title">Upload Document</h2>
			<button
				class="close-btn"
				onclick={() => (docStore.isUploaderOpen = false)}
				aria-label="Close upload dialog"
			>
				<X size={16} />
			</button>
		</header>

		<div class="modal-body">
			<div
				class="dropzone"
				class:dragging={isDragging}
				class:uploading={isUploading}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				onclick={() => fileInputRef?.click()}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && fileInputRef?.click()}
			>
				<input
					type="file"
					accept=".pdf,.md,.txt"
					bind:this={fileInputRef}
					onchange={handleFileSelected}
					style="display: none;"
				/>

				{#if isUploading}
					<div class="status-box">
						<Loader2 size={28} class="spinner" />
						<p class="status-title">Converting to Markdown...</p>
					</div>
				{:else if successMessage}
					<div class="status-box">
						<Check size={28} />
						<p class="status-title">{successMessage}</p>
					</div>
				{:else}
					<div class="status-box">
						<Upload size={28} />
						<p class="drop-title">Drop PDF or Markdown here</p>
						<p class="drop-subtitle">or click to choose file</p>
						<span class="file-badge">PDF • MD • TXT</span>
					</div>
				{/if}
			</div>

			{#if errorMessage}
				<div class="error-banner" role="alert">
					<AlertCircle size={16} />
					<span>{errorMessage}</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.uploader-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 70;
	}

	.uploader-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 440px;
		max-width: 90vw;
		background: var(--theme-surface, #141414);
		border: 1px solid var(--theme-border, #282828);
		border-radius: 6px;
		color: var(--theme-text, #ffffff);
		z-index: 75;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1.25rem;
		border-bottom: 1px solid var(--theme-border, #282828);
	}

	.modal-title {
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0;
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

	.modal-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.dropzone {
		border: 1px dashed var(--theme-border, #282828);
		border-radius: 4px;
		padding: 2rem 1rem;
		text-align: center;
		cursor: pointer;
		background: transparent;
		transition: all 0.12s ease;
	}

	.dropzone:hover,
	.dropzone.dragging {
		border-color: var(--theme-text, #ffffff);
		background: rgba(128, 128, 128, 0.05);
	}

	.status-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.drop-title {
		font-weight: 600;
		font-size: 0.9rem;
		margin: 0;
	}

	.drop-subtitle {
		font-size: 0.78rem;
		opacity: 0.65;
		margin: 0;
	}

	.file-badge {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border: 1px solid var(--theme-border, #282828);
		border-radius: 3px;
		margin-top: 0.35rem;
		opacity: 0.7;
	}

	:global(.spinner) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		font-size: 0.8rem;
		background: rgba(128, 128, 128, 0.1);
	}
</style>
