<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import type { HeadingItem } from '$lib/types';
	import { List, X } from 'lucide-svelte';

	function extractHeadings(content: string): HeadingItem[] {
		if (!content) return [];
		const headingLines = content.match(/^#{1,4}\s+.+$/gm) || [];
		return headingLines.map((line, index) => {
			const level = line.match(/^#+/)?.[0].length || 1;
			const text = line.replace(/^#+\s*/, '').trim();
			const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
			return { level, text, id };
		});
	}

	const headings = $derived(
		docStore.activeDocument ? extractHeadings(docStore.activeDocument.content) : []
	);

	function scrollToHeading(index: number) {
		const headingElements = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4');
		if (headingElements[index]) {
			headingElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
			docStore.isTocOpen = false;
		}
	}
</script>

{#if docStore.isTocOpen}
	<div class="toc-backdrop" onclick={() => (docStore.isTocOpen = false)} aria-hidden="true"></div>
	<aside class="toc-panel" aria-label="Table of Contents">
		<header class="toc-header">
			<div class="header-title">
				<List size={16} />
				<span>Contents</span>
			</div>
			<button
				class="close-btn"
				onclick={() => (docStore.isTocOpen = false)}
				aria-label="Close Table of Contents"
			>
				<X size={16} />
			</button>
		</header>

		<div class="toc-content">
			{#if headings.length === 0}
				<p class="empty-state">No section headings found.</p>
			{:else}
				<ul class="heading-list">
					{#each headings as heading, idx}
						<li class="heading-item level-{heading.level}">
							<button class="heading-btn" onclick={() => scrollToHeading(idx)}>
								{heading.text}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>
{/if}

<style>
	.toc-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 50;
	}

	.toc-panel {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 300px;
		max-width: 85vw;
		background: var(--theme-surface, #141414);
		border-left: 1px solid var(--theme-border, #282828);
		color: var(--theme-text, #ffffff);
		z-index: 55;
		display: flex;
		flex-direction: column;
	}

	.toc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1rem;
		border-bottom: 1px solid var(--theme-border, #282828);
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-weight: 600;
		font-size: 0.9rem;
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

	.toc-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
	}

	.empty-state {
		font-size: 0.8rem;
		opacity: 0.6;
		text-align: center;
		margin-top: 2rem;
	}

	.heading-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.heading-item.level-1 {
		font-weight: 600;
		padding-left: 0;
	}

	.heading-item.level-2 {
		padding-left: 0.65rem;
		font-size: 0.85rem;
	}

	.heading-item.level-3 {
		padding-left: 1.25rem;
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.heading-btn {
		background: transparent;
		border: none;
		color: inherit;
		text-align: left;
		cursor: pointer;
		width: 100%;
		padding: 0.3rem 0.45rem;
		border-radius: 4px;
		line-height: 1.35;
		transition: background 0.12s ease;
	}

	.heading-btn:hover {
		background: rgba(128, 128, 128, 0.15);
	}
</style>
