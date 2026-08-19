<script lang="ts">
	import { marked } from 'marked';
	import { docStore } from '$lib/stores/documents.svelte';
	import { readerSettings } from '$lib/stores/settings.svelte';
	import { applyBionicToHtml } from '$lib/utils/bionic';

	const rawMarkdown = $derived(docStore.activeDocument?.content || '');

	const parsedHtml = $derived.by(() => {
		if (!rawMarkdown) return '';
		const html = marked.parse(rawMarkdown, { breaks: true, gfm: true }) as string;
		if (readerSettings.current.bionicEnabled) {
			return applyBionicToHtml(html, readerSettings.current.bionicFixation);
		}
		return html;
	});
</script>

<article
	class="markdown-content width-{readerSettings.current.contentWidth} align-{readerSettings.current.textAlign}"
	class:highlight-paragraphs={readerSettings.current.highlightActiveParagraph}
>
	{@html parsedHtml}
</article>

<style>
	.markdown-content {
		width: 100%;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 6rem;
		font-family: var(--reader-font, 'Lexend', sans-serif);
		font-size: var(--reader-font-size, 18px);
		line-height: var(--reader-line-height, 1.8);
		letter-spacing: var(--reader-letter-spacing, 0.5px);
		word-spacing: var(--reader-word-spacing, 1.5px);
		color: var(--theme-text, #ffffff);
		word-break: break-word;
	}

	/* Width constraints */
	.width-narrow {
		max-width: 600px;
	}
	.width-normal {
		max-width: 740px;
	}
	.width-wide {
		max-width: 920px;
	}
	.width-full {
		max-width: 100%;
	}

	/* Text alignments */
	.align-left {
		text-align: left;
	}
	.align-justify {
		text-align: justify;
	}
	.align-center {
		text-align: center;
	}

	/* Minimal typography */
	:global(.markdown-content h1) {
		font-size: 2em;
		font-weight: 700;
		line-height: 1.25;
		margin: 1.6em 0 0.8em;
		color: var(--theme-text, #ffffff);
		border-bottom: 1px solid var(--theme-border, #282828);
		padding-bottom: 0.4em;
	}

	:global(.markdown-content h2) {
		font-size: 1.5em;
		font-weight: 700;
		line-height: 1.3;
		margin: 1.5em 0 0.6em;
		color: var(--theme-text, #ffffff);
	}

	:global(.markdown-content h3) {
		font-size: 1.2em;
		font-weight: 600;
		line-height: 1.35;
		margin: 1.3em 0 0.5em;
		color: var(--theme-text, #ffffff);
	}

	:global(.markdown-content p) {
		margin: 1.1em 0;
	}

	/* Bionic / bold text: purely bolded, never altering font color */
	:global(.markdown-content b),
	:global(.markdown-content strong) {
		font-weight: 700;
		color: inherit;
	}

	:global(.markdown-content ul),
	:global(.markdown-content ol) {
		margin: 1.1em 0;
		padding-left: 1.75em;
	}

	:global(.markdown-content li) {
		margin: 0.35em 0;
	}

	:global(.markdown-content blockquote) {
		margin: 1.2em 0;
		padding: 0.6em 1.2em;
		border-left: 2px solid var(--theme-text, #ffffff);
		background: var(--theme-surface, #141414);
		border-radius: 0;
		opacity: 0.9;
	}

	:global(.markdown-content table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5em 0;
		font-size: 0.95em;
	}

	:global(.markdown-content th),
	:global(.markdown-content td) {
		border: 1px solid var(--theme-border, #282828);
		padding: 0.55em 0.85em;
		text-align: left;
	}

	:global(.markdown-content th) {
		background: var(--theme-surface, #1e1e1e);
		font-weight: 700;
	}

	:global(.markdown-content code) {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.88em;
		background: var(--theme-surface, #181818);
		padding: 0.15em 0.35em;
		border-radius: 3px;
		border: 1px solid var(--theme-border, #282828);
	}

	:global(.markdown-content pre) {
		background: var(--theme-surface, #141414);
		border: 1px solid var(--theme-border, #282828);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1.2em 0;
	}

	:global(.markdown-content pre code) {
		background: transparent;
		padding: 0;
		border: none;
	}

	:global(.markdown-content hr) {
		border: none;
		height: 1px;
		background: var(--theme-border, #282828);
		margin: 2em 0;
	}

	:global(.markdown-content a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
		font-weight: 600;
	}

	/* Paragraph isolation */
	.highlight-paragraphs :global(p),
	.highlight-paragraphs :global(li),
	.highlight-paragraphs :global(blockquote) {
		transition: opacity 0.15s ease;
		padding: 0.15em 0.3em;
		border-radius: 3px;
	}

	.highlight-paragraphs:hover :global(p:not(:hover)),
	.highlight-paragraphs:hover :global(li:not(:hover)),
	.highlight-paragraphs:hover :global(blockquote:not(:hover)) {
		opacity: 0.55;
	}

	.highlight-paragraphs :global(p:hover),
	.highlight-paragraphs :global(li:hover),
	.highlight-paragraphs :global(blockquote:hover) {
		opacity: 1;
		background: var(--theme-surface, #1e1e1e);
	}
</style>
