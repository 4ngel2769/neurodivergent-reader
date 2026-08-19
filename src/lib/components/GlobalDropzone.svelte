<script lang="ts">
	import { onMount } from 'svelte';
	import { docStore } from '$lib/stores/documents.svelte';
	import { uploadFile } from '$lib/utils/upload';
	import { Upload } from 'lucide-svelte';

	let isDragging = $state(false);
	let dragDepth = 0;

	function handleDragEnter(e: DragEvent) {
		if (!hasFiles(e)) return;
		e.preventDefault();
		dragDepth += 1;
		isDragging = true;
	}

	function handleDragOver(e: DragEvent) {
		if (!hasFiles(e)) return;
		e.preventDefault();
	}

	function handleDragLeave(e: DragEvent) {
		if (!hasFiles(e)) return;
		e.preventDefault();
		dragDepth -= 1;
		if (dragDepth <= 0) {
			dragDepth = 0;
			isDragging = false;
		}
	}

	async function handleDrop(e: DragEvent) {
		if (!hasFiles(e)) return;
		e.preventDefault();
		dragDepth = 0;
		isDragging = false;

		const file = e.dataTransfer?.files?.[0];
		if (!file) return;

		const result = await uploadFile(file);
		if (result.success && result.document) {
			await docStore.fetchAll();
			await docStore.selectDocument(result.document.id);
		}
	}

	function hasFiles(e: DragEvent): boolean {
		return Boolean(e.dataTransfer?.types.includes('Files'));
	}

	onMount(() => {
		window.addEventListener('dragenter', handleDragEnter);
		window.addEventListener('dragover', handleDragOver);
		window.addEventListener('dragleave', handleDragLeave);
		window.addEventListener('drop', handleDrop);
		return () => {
			window.removeEventListener('dragenter', handleDragEnter);
			window.removeEventListener('dragover', handleDragOver);
			window.removeEventListener('dragleave', handleDragLeave);
			window.removeEventListener('drop', handleDrop);
		};
	});
</script>

{#if isDragging}
	<div class="drop-overlay" aria-hidden="true">
		<div class="drop-message">
			<Upload size={32} />
			<p>Drop to upload PDF, MD, or TXT</p>
		</div>
	</div>
{/if}

<style>
	.drop-overlay {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgba(0, 0, 0, 0.55);
		border: 3px dashed var(--theme-text, #ffffff);
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.drop-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		color: var(--theme-text, #ffffff);
		font-weight: 600;
		font-size: 0.95rem;
	}
</style>
