<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import { X } from 'lucide-svelte';

	function handleSelect(id: string) {
		if (docStore.activeDocument?.id !== id) {
			docStore.selectDocument(id);
		}
	}

	function handleClose(e: MouseEvent, id: string) {
		e.stopPropagation();
		docStore.closeTab(id);
	}
</script>

{#if docStore.openTabs.length > 1}
	<div class="tabs-bar" role="tablist" aria-label="Open documents">
		{#each docStore.openTabs as tab (tab.id)}
			<button
				class="tab"
				class:active={docStore.activeDocument?.id === tab.id}
				role="tab"
				aria-selected={docStore.activeDocument?.id === tab.id}
				onclick={() => handleSelect(tab.id)}
			>
				<span class="tab-title">{tab.title}</span>
				<span
					class="tab-close"
					onclick={(e) => handleClose(e, tab.id)}
					role="button"
					tabindex="0"
					aria-label={`Close ${tab.title}`}
					onkeydown={(e) => e.key === 'Enter' && handleClose(e as unknown as MouseEvent, tab.id)}
				>
					<X size={12} />
				</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.tabs-bar {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.4rem 0.75rem;
		background: var(--theme-surface, #141414);
		border-bottom: 1px solid var(--theme-border, #282828);
		overflow-x: auto;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		max-width: 200px;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		border: 1px solid transparent;
		background: transparent;
		color: inherit;
		font-size: 0.78rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.tab:hover {
		background: rgba(128, 128, 128, 0.12);
	}

	.tab.active {
		background: rgba(128, 128, 128, 0.18);
		border-color: var(--theme-border, #282828);
		font-weight: 600;
	}

	.tab-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tab-close {
		display: flex;
		opacity: 0.6;
		border-radius: 3px;
		padding: 0.1rem;
	}

	.tab-close:hover {
		opacity: 1;
		background: rgba(128, 128, 128, 0.25);
	}
</style>
