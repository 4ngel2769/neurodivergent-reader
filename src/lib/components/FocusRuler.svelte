<script lang="ts">
	import { onMount } from 'svelte';
	import { readerSettings } from '$lib/stores/settings.svelte';

	let mouseY = $state(200);

	function handleMouseMove(event: MouseEvent) {
		mouseY = event.clientY;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && event.altKey) {
			mouseY = Math.min(window.innerHeight - 50, mouseY + 30);
		} else if (event.key === 'ArrowUp' && event.altKey) {
			mouseY = Math.max(50, mouseY - 30);
		}
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const rulerHeight = $derived(readerSettings.current.focusRulerHeight);
	const halfHeight = $derived(rulerHeight / 2);
	const rulerTop = $derived(Math.max(0, mouseY - halfHeight));
	const rulerBottom = $derived(rulerTop + rulerHeight);
</script>

{#if readerSettings.current.focusMaskEnabled}
	<!-- Top Mask -->
	<div
		class="focus-mask mask-top"
		style="height: {rulerTop}px; opacity: {readerSettings.current.focusMaskOpacity};"
		aria-hidden="true"
	></div>

	<!-- Bottom Mask -->
	<div
		class="focus-mask mask-bottom"
		style="top: {rulerBottom}px; opacity: {readerSettings.current.focusMaskOpacity};"
		aria-hidden="true"
	></div>
{/if}

{#if readerSettings.current.focusRulerEnabled}
	<!-- Reading Line Ruler -->
	<div
		class="focus-ruler-bar"
		style="top: {rulerTop}px; height: {rulerHeight}px;"
		aria-hidden="true"
	>
		<div class="ruler-line line-top"></div>
		<div class="ruler-line line-bottom"></div>
	</div>
{/if}

<style>
	.focus-mask {
		position: fixed;
		left: 0;
		right: 0;
		background: #000000;
		z-index: 40;
		pointer-events: none;
	}

	.mask-top {
		top: 0;
	}

	.mask-bottom {
		bottom: 0;
	}

	.focus-ruler-bar {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 45;
		pointer-events: none;
		background: rgba(128, 128, 128, 0.05);
	}

	.ruler-line {
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--theme-text, #ffffff);
		opacity: 0.35;
	}

	.line-top {
		top: 0;
	}

	.line-bottom {
		bottom: 0;
	}
</style>
