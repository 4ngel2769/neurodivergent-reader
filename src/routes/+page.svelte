<script lang="ts">
	import { onMount } from 'svelte';
	import { docStore } from '$lib/stores/documents.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ReadingProgressBar from '$lib/components/ReadingProgressBar.svelte';
	import FocusRuler from '$lib/components/FocusRuler.svelte';
	import DocumentTabs from '$lib/components/DocumentTabs.svelte';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import FileUploader from '$lib/components/FileUploader.svelte';
	import GlobalDropzone from '$lib/components/GlobalDropzone.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import TtsPlayer from '$lib/components/TtsPlayer.svelte';
	import { BookOpen, Upload, Plus } from 'lucide-svelte';

	onMount(() => {
		docStore.fetchAll();
	});
</script>

<svelte:head>
	<title>{docStore.activeDocument ? `${docStore.activeDocument.title} - NeuroRead` : 'NeuroRead'}</title>
</svelte:head>

<ReadingProgressBar />
<Navbar />
<DocumentTabs />
<FocusRuler />

<main class="main-viewport">
	{#if docStore.isLoading && !docStore.activeDocument}
		<div class="center-state">
			<p class="loading-text">Loading...</p>
		</div>
	{:else if docStore.isEditorMode}
		<MarkdownEditor />
	{:else if docStore.activeDocument}
		<MarkdownViewer />
	{:else}
		<div class="center-state empty-library">
			<div class="empty-icon-wrap">
				<BookOpen size={36} />
			</div>
			<h2 class="empty-title">NeuroRead</h2>
			<p class="empty-subtitle">
				Clean, distraction-free reading optimized for neurodivergent minds and dyslexia.
			</p>

			<div class="empty-actions">
				<button
					class="btn-primary"
					onclick={() => (docStore.isUploaderOpen = true)}
				>
					<Upload size={15} />
					<span>Upload Document</span>
				</button>

				<button
					class="btn-secondary"
					onclick={() => docStore.createNewDocument()}
				>
					<Plus size={15} />
					<span>New Note</span>
				</button>
			</div>
		</div>
	{/if}
</main>

<Sidebar />
<TableOfContents />
<FileUploader />
<GlobalDropzone />
<SettingsModal />
<TtsPlayer />

<style>
	.main-viewport {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.center-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		text-align: center;
		min-height: 65vh;
	}

	.loading-text {
		font-size: 0.9rem;
		opacity: 0.6;
	}

	.empty-library {
		max-width: 440px;
		margin: 0 auto;
	}

	.empty-icon-wrap {
		width: 64px;
		height: 64px;
		border-radius: 4px;
		border: 1px solid var(--theme-border, #282828);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.25rem;
		opacity: 0.8;
	}

	.empty-title {
		font-size: 1.4rem;
		font-weight: 700;
		margin: 0 0 0.4rem;
		color: var(--theme-text, #ffffff);
	}

	.empty-subtitle {
		font-size: 0.88rem;
		opacity: 0.7;
		margin: 0 0 1.75rem;
		line-height: 1.45;
	}

	.empty-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	.btn-primary,
	.btn-secondary {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 1.1rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.btn-primary {
		background: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		border: 1px solid var(--theme-text, #ffffff);
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.btn-secondary {
		background: transparent;
		color: var(--theme-text, #ffffff);
		border: 1px solid var(--theme-border, #282828);
	}

	.btn-secondary:hover {
		background: rgba(128, 128, 128, 0.15);
	}
</style>
