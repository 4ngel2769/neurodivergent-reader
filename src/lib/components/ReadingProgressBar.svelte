<script lang="ts">
	import { onMount } from 'svelte';

	let progress = $state(0);

	function updateScrollProgress() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		if (docHeight > 0) {
			progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
		} else {
			progress = 0;
		}
	}

	onMount(() => {
		window.addEventListener('scroll', updateScrollProgress, { passive: true });
		return () => window.removeEventListener('scroll', updateScrollProgress);
	});
</script>

<div class="progress-container" aria-hidden="true">
	<div class="progress-bar" style="width: {progress}%"></div>
</div>

<style>
	.progress-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: transparent;
		z-index: 100;
		pointer-events: none;
	}

	.progress-bar {
		height: 100%;
		background: var(--theme-text, #ffffff);
		opacity: 0.6;
		transition: width 0.1s linear;
	}
</style>
