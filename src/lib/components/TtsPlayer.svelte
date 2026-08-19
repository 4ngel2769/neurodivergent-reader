<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import { readerSettings } from '$lib/stores/settings.svelte';
	import { isSpeechSupported, pauseSpeaking, resumeSpeaking, speakText, stopSpeaking } from '$lib/utils/speech';
	import { Play, Pause, Square, SkipBack, SkipForward, Volume2, X } from 'lucide-svelte';

	let isPlaying = $state(false);
	let isPaused = $state(false);
	let currentParagraphIndex = $state(0);

	const paragraphs = $derived(
		docStore.activeDocument
			? docStore.activeDocument.content
					.split(/\n\s*\n/)
					.map((p) => p.trim())
					.filter(Boolean)
			: []
	);

	function playCurrent() {
		if (paragraphs.length === 0) return;
		if (currentParagraphIndex >= paragraphs.length) {
			currentParagraphIndex = 0;
		}

		const textToSpeak = paragraphs[currentParagraphIndex];
		isPlaying = true;
		isPaused = false;

		speakText(textToSpeak, {
			rate: readerSettings.current.ttsRate,
			pitch: readerSettings.current.ttsPitch,
			voiceName: readerSettings.current.ttsVoice,
			onStart: () => {
				isPlaying = true;
				isPaused = false;
			},
			onEnd: () => {
				if (currentParagraphIndex < paragraphs.length - 1) {
					currentParagraphIndex += 1;
					playCurrent();
				} else {
					isPlaying = false;
					isPaused = false;
					currentParagraphIndex = 0;
				}
			},
			onError: () => {
				isPlaying = false;
				isPaused = false;
			}
		});
	}

	function handleTogglePlay() {
		if (!isPlaying) {
			playCurrent();
		} else if (isPaused) {
			resumeSpeaking();
			isPaused = false;
		} else {
			pauseSpeaking();
			isPaused = true;
		}
	}

	function handleStop() {
		stopSpeaking();
		isPlaying = false;
		isPaused = false;
	}

	function handlePrevious() {
		stopSpeaking();
		currentParagraphIndex = Math.max(0, currentParagraphIndex - 1);
		playCurrent();
	}

	function handleNext() {
		stopSpeaking();
		if (currentParagraphIndex < paragraphs.length - 1) {
			currentParagraphIndex += 1;
			playCurrent();
		}
	}

	function changeSpeed(rate: number) {
		readerSettings.update('ttsRate', rate);
		if (isPlaying && !isPaused) {
			playCurrent();
		}
	}
</script>

{#if docStore.isTtsOpen && isSpeechSupported()}
	<div class="tts-bar" role="region" aria-label="Text to speech player">
		<div class="tts-info">
			<Volume2 size={15} />
			<span class="paragraph-counter">
				{paragraphs.length > 0 ? currentParagraphIndex + 1 : 0}/{paragraphs.length}
			</span>
		</div>

		<div class="tts-controls">
			<button
				class="ctrl-btn"
				onclick={handlePrevious}
				disabled={currentParagraphIndex === 0}
				aria-label="Previous paragraph"
			>
				<SkipBack size={14} />
			</button>

			<button
				class="ctrl-btn main-play-btn"
				onclick={handleTogglePlay}
				aria-label={isPlaying && !isPaused ? 'Pause speech' : 'Play speech'}
			>
				{#if isPlaying && !isPaused}
					<Pause size={14} />
				{:else}
					<Play size={14} />
				{/if}
			</button>

			<button class="ctrl-btn" onclick={handleStop} disabled={!isPlaying} aria-label="Stop speech">
				<Square size={13} />
			</button>

			<button
				class="ctrl-btn"
				onclick={handleNext}
				disabled={currentParagraphIndex >= paragraphs.length - 1}
				aria-label="Next paragraph"
			>
				<SkipForward size={14} />
			</button>
		</div>

		<div class="tts-speed-selector">
			{#each [0.8, 1.0, 1.25, 1.5] as rate}
				<button
					class="speed-btn"
					class:active={readerSettings.current.ttsRate === rate}
					onclick={() => changeSpeed(rate)}
				>
					{rate}x
				</button>
			{/each}
		</div>

		<button
			class="ctrl-btn close-tts-btn"
			onclick={() => {
				handleStop();
				docStore.isTtsOpen = false;
			}}
			aria-label="Close text to speech player"
		>
			<X size={14} />
		</button>
	</div>
{/if}

<style>
	.tts-bar {
		position: fixed;
		bottom: 1.25rem;
		left: 50%;
		transform: translateX(-50%);
		background: var(--theme-surface, #141414);
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 0.35rem 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.85rem;
		z-index: 60;
		max-width: 95vw;
		color: var(--theme-text, #ffffff);
	}

	.tts-info {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.78rem;
		font-weight: 500;
		opacity: 0.8;
	}

	.tts-controls {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.ctrl-btn {
		background: transparent;
		border: 1px solid var(--theme-border, #282828);
		color: inherit;
		width: 26px;
		height: 26px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.ctrl-btn:hover:not(:disabled) {
		background: rgba(128, 128, 128, 0.15);
	}

	.ctrl-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.main-play-btn {
		background: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		border-color: var(--theme-text, #ffffff);
	}

	.tts-speed-selector {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		background: rgba(128, 128, 128, 0.1);
		padding: 0.15rem;
		border-radius: 3px;
	}

	.speed-btn {
		background: transparent;
		border: none;
		color: inherit;
		font-size: 0.7rem;
		padding: 0.15rem 0.4rem;
		border-radius: 2px;
		cursor: pointer;
		opacity: 0.6;
		transition: all 0.12s ease;
	}

	.speed-btn.active {
		background: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		font-weight: 700;
		opacity: 1;
	}

	.close-tts-btn {
		margin-left: 0.15rem;
	}
</style>
