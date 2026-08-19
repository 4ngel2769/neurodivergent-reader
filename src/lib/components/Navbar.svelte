<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import { readerSettings } from '$lib/stores/settings.svelte';
	import {
		BookOpen,
		Sliders,
		Sparkles,
		Ruler,
		Eye,
		Volume2,
		Edit3,
		List,
		Clock
	} from 'lucide-svelte';

	function handleToggleSidebar() {
		docStore.isSidebarOpen = !docStore.isSidebarOpen;
	}

	function handleToggleSettings() {
		docStore.isSettingsOpen = !docStore.isSettingsOpen;
	}

	function handleToggleToc() {
		docStore.isTocOpen = !docStore.isTocOpen;
	}

	function handleToggleTts() {
		docStore.isTtsOpen = !docStore.isTtsOpen;
	}

	function handleToggleEditor() {
		docStore.isEditorMode = !docStore.isEditorMode;
	}
</script>

<header class="app-navbar">
	<div class="navbar-left">
		<button
			class="nav-btn library-btn"
			onclick={handleToggleSidebar}
			title="Open Document Library (D)"
			aria-label="Open Document Library"
		>
			<BookOpen size={16} />
			<span class="app-title">NeuroRead</span>
		</button>
	</div>

	<div class="navbar-center">
		{#if docStore.activeDocument}
			<div class="doc-header-info">
				<h1 class="active-title">{docStore.activeDocument.title}</h1>
				<div class="active-meta">
					<span>{docStore.activeDocument.wordCount} words</span>
					<span>•</span>
					<span class="meta-item">
						<Clock size={11} />
						{docStore.activeDocument.readingTimeMinutes} min read
					</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="navbar-right">
		<!-- Bionic Reading Toggle -->
		<button
			class="nav-icon-btn"
			class:active={readerSettings.current.bionicEnabled}
			onclick={() => readerSettings.toggleBionic()}
			title="Toggle Bionic Reading (B)"
			aria-label="Toggle Bionic Reading"
		>
			<Sparkles size={15} />
			<span class="btn-text">Bionic</span>
		</button>

		<!-- Focus Ruler Toggle -->
		<button
			class="nav-icon-btn"
			class:active={readerSettings.current.focusRulerEnabled}
			onclick={() => readerSettings.toggleFocusRuler()}
			title="Toggle Reading Ruler (R)"
			aria-label="Toggle Reading Ruler"
		>
			<Ruler size={15} />
		</button>

		<!-- Focus Mask Toggle -->
		<button
			class="nav-icon-btn"
			class:active={readerSettings.current.focusMaskEnabled}
			onclick={() => readerSettings.toggleFocusMask()}
			title="Toggle Focus Spotlight Mask"
			aria-label="Toggle Focus Mask"
		>
			<Eye size={15} />
		</button>

		<!-- TTS Player Toggle -->
		<button
			class="nav-icon-btn"
			class:active={docStore.isTtsOpen}
			onclick={handleToggleTts}
			title="Toggle Text to Speech"
			aria-label="Toggle Text to Speech"
		>
			<Volume2 size={15} />
		</button>

		<!-- TOC Toggle -->
		<button
			class="nav-icon-btn"
			class:active={docStore.isTocOpen}
			onclick={handleToggleToc}
			title="Table of Contents"
			aria-label="Table of Contents"
		>
			<List size={15} />
		</button>

		<!-- Edit Mode Toggle -->
		<button
			class="nav-icon-btn"
			class:active={docStore.isEditorMode}
			onclick={handleToggleEditor}
			title="Toggle Markdown Edit Mode (E)"
			aria-label="Toggle Markdown Edit Mode"
		>
			<Edit3 size={15} />
		</button>

		<!-- Settings Modal Toggle -->
		<button
			class="nav-icon-btn"
			class:active={docStore.isSettingsOpen}
			onclick={handleToggleSettings}
			title="Accessibility Settings (S)"
			aria-label="Accessibility Settings"
		>
			<Sliders size={15} />
		</button>
	</div>
</header>

<style>
	.app-navbar {
		position: sticky;
		top: 0;
		height: 52px;
		background: var(--theme-surface, #141414);
		border-bottom: 1px solid var(--theme-border, #282828);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		z-index: 30;
		color: var(--theme-text, #ffffff);
	}

	.navbar-left,
	.navbar-right {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		background: transparent;
		border: 1px solid transparent;
		color: inherit;
		padding: 0.35rem 0.6rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: background 0.15s ease;
	}

	.nav-btn:hover {
		background: rgba(128, 128, 128, 0.15);
	}

	.app-title {
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.navbar-center {
		flex: 1;
		display: flex;
		justify-content: center;
		overflow: hidden;
		padding: 0 0.75rem;
	}

	.doc-header-info {
		text-align: center;
		max-width: 380px;
	}

	.active-title {
		font-size: 0.85rem;
		font-weight: 600;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.active-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		font-size: 0.7rem;
		opacity: 0.65;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.nav-icon-btn {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		background: transparent;
		border: 1px solid var(--theme-border, #282828);
		color: inherit;
		padding: 0.35rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.78rem;
		font-weight: 500;
		transition: all 0.12s ease;
	}

	.nav-icon-btn:hover {
		background: rgba(128, 128, 128, 0.15);
	}

	.nav-icon-btn.active {
		background: var(--theme-text, #ffffff);
		border-color: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.btn-text,
		.active-meta {
			display: none;
		}
		.navbar-center {
			display: none;
		}
	}
</style>
