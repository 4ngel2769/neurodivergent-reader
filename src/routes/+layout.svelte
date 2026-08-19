<script lang="ts">
	import { onMount } from 'svelte';
	import { readerSettings } from '$lib/stores/settings.svelte';
	import { docStore } from '$lib/stores/documents.svelte';
	import { AVAILABLE_FONTS, AVAILABLE_THEMES } from '$lib/constants';

	let { children } = $props();

	const activeTheme = $derived.by(() => {
		if (readerSettings.current.themeId === 'custom') {
			return {
				bg: readerSettings.current.customBgColor,
				text: readerSettings.current.customTextColor,
				accent: readerSettings.current.customTextColor,
				surface: '#181818',
				border: '#2c2c2c'
			};
		}
		const found = AVAILABLE_THEMES.find(
			(t) => t.id === readerSettings.current.themeId
		);
		return (
			found || {
				bg: '#141414',
				text: '#d6d6d6',
				accent: '#ffffff',
				surface: '#1e1e1e',
				border: '#2c2c2c'
			}
		);
	});

	const activeFont = $derived.by(() => {
		const found = AVAILABLE_FONTS.find(
			(f) => f.id === readerSettings.current.fontFamily
		);
		return found?.cssValue || "'Lexend', sans-serif";
	});

	function handleGlobalKeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		// Don't trigger shortcuts if typing in input or textarea
		if (
			target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.isContentEditable
		) {
			return;
		}

		if (e.key === 'b' || e.key === 'B') {
			e.preventDefault();
			readerSettings.toggleBionic();
		} else if (e.key === 'r' || e.key === 'R') {
			e.preventDefault();
			readerSettings.toggleFocusRuler();
		} else if (e.key === 's' || e.key === 'S') {
			e.preventDefault();
			docStore.isSettingsOpen = !docStore.isSettingsOpen;
		} else if (e.key === 'd' || e.key === 'D') {
			e.preventDefault();
			docStore.isSidebarOpen = !docStore.isSidebarOpen;
		} else if (e.key === 'e' || e.key === 'E') {
			e.preventDefault();
			docStore.isEditorMode = !docStore.isEditorMode;
		} else if (e.key === 'Escape') {
			docStore.isSettingsOpen = false;
			docStore.isSidebarOpen = false;
			docStore.isUploaderOpen = false;
			docStore.isTocOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleGlobalKeydown);
		return () => window.removeEventListener('keydown', handleGlobalKeydown);
	});
</script>

<div
	class="app-shell"
	class:reduced-motion={readerSettings.current.reducedMotion}
	style="
		--theme-bg: {activeTheme.bg};
		--theme-text: {activeTheme.text};
		--theme-accent: {activeTheme.accent};
		--theme-surface: {activeTheme.surface};
		--theme-border: {activeTheme.border};
		--reader-font: {activeFont};
		--reader-font-size: {readerSettings.current.fontSize}px;
		--reader-line-height: {readerSettings.current.lineHeight};
		--reader-letter-spacing: {readerSettings.current.letterSpacing}px;
		--reader-word-spacing: {readerSettings.current.wordSpacing}px;
	"
>
	{@render children?.()}
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		background: var(--theme-bg, #141414);
		color: var(--theme-text, #ffffff);
		font-family: var(--reader-font, 'Lexend', sans-serif);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		box-sizing: border-box;
	}

	:global(*, *::before, *::after) {
		box-sizing: inherit;
	}

	.app-shell {
		min-height: 100vh;
		background: var(--theme-bg, #141414);
		color: var(--theme-text, #ffffff);
		display: flex;
		flex-direction: column;
	}

	/* Reduced motion accessibility mode */
	:global(.reduced-motion),
	:global(.reduced-motion *) {
		animation-duration: 0.001ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.001ms !important;
		scroll-behavior: auto !important;
	}

	/* Minimal scrollbars */
	:global(::-webkit-scrollbar) {
		width: 6px;
		height: 6px;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--theme-border, #282828);
		border-radius: 2px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--theme-text, #ffffff);
		opacity: 0.8;
	}
</style>
