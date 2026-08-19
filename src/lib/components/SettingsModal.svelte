<script lang="ts">
	import { docStore } from '$lib/stores/documents.svelte';
	import { readerSettings } from '$lib/stores/settings.svelte';
	import { AVAILABLE_FONTS, AVAILABLE_THEMES, BUILTIN_PRESETS } from '$lib/constants';
	import type { ContentWidth, TextAlign } from '$lib/types';
	import {
		Sliders,
		Type,
		Palette,
		Eye,
		RotateCcw,
		X,
		Check,
		Sparkles
	} from 'lucide-svelte';

	let activeTab = $state<'presets' | 'typography' | 'colors' | 'focus'>('presets');
</script>

{#if docStore.isSettingsOpen}
	<div
		class="modal-backdrop"
		onclick={() => (docStore.isSettingsOpen = false)}
		aria-hidden="true"
	></div>
	<div class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
		<header class="modal-header">
			<div class="header-brand">
				<Sliders size={16} />
				<h2 id="settings-title" class="modal-title">Settings</h2>
			</div>
			<button
				class="close-btn"
				onclick={() => (docStore.isSettingsOpen = false)}
				aria-label="Close settings dialog"
			>
				<X size={16} />
			</button>
		</header>

		<!-- Tabs -->
		<nav class="settings-tabs" aria-label="Settings navigation">
			<button
				class="tab-btn"
				class:active={activeTab === 'presets'}
				onclick={() => (activeTab = 'presets')}
			>
				<Sparkles size={14} />
				<span>Presets</span>
			</button>
			<button
				class="tab-btn"
				class:active={activeTab === 'typography'}
				onclick={() => (activeTab = 'typography')}
			>
				<Type size={14} />
				<span>Typography</span>
			</button>
			<button
				class="tab-btn"
				class:active={activeTab === 'colors'}
				onclick={() => (activeTab = 'colors')}
			>
				<Palette size={14} />
				<span>Themes</span>
			</button>
			<button
				class="tab-btn"
				class:active={activeTab === 'focus'}
				onclick={() => (activeTab = 'focus')}
			>
				<Eye size={14} />
				<span>Focus</span>
			</button>
		</nav>

		<!-- Tab Content -->
		<div class="modal-body">
			{#if activeTab === 'presets'}
				<div class="section">
					<div class="presets-grid">
						{#each BUILTIN_PRESETS as preset}
							<button
								class="preset-card"
								onclick={() => readerSettings.applyPreset(preset.id)}
							>
								<div class="preset-header">
									<span class="preset-name">{preset.name}</span>
								</div>
								<p class="preset-desc">{preset.description}</p>
							</button>
						{/each}
					</div>

					<div class="reset-wrapper">
						<button class="reset-btn" onclick={() => readerSettings.reset()}>
							<RotateCcw size={14} />
							<span>Reset Defaults</span>
						</button>
					</div>
				</div>
			{:else if activeTab === 'typography'}
				<div class="section">
					<h3 class="group-title">Font Family</h3>
					<div class="fonts-grid">
						{#each AVAILABLE_FONTS as font}
							<button
								class="font-card"
								class:active={readerSettings.current.fontFamily === font.id}
								style="font-family: {font.cssValue};"
								onclick={() => readerSettings.update('fontFamily', font.id)}
							>
								<span class="font-name">{font.name}</span>
								<span class="font-sample">Aa Bb Gg 123</span>
							</button>
						{/each}
					</div>

					<h3 class="group-title">Sizing & Spacing</h3>
					<div class="sliders-grid">
						<label class="slider-row">
							<div class="slider-label">
								<span>Font Size</span>
								<span class="slider-val">{readerSettings.current.fontSize}px</span>
							</div>
							<input
								type="range"
								min="14"
								max="34"
								step="1"
								value={readerSettings.current.fontSize}
								oninput={(e) => readerSettings.update('fontSize', Number(e.currentTarget.value))}
							/>
						</label>

						<label class="slider-row">
							<div class="slider-label">
								<span>Line Spacing</span>
								<span class="slider-val">{readerSettings.current.lineHeight}x</span>
							</div>
							<input
								type="range"
								min="1.4"
								max="2.8"
								step="0.1"
								value={readerSettings.current.lineHeight}
								oninput={(e) => readerSettings.update('lineHeight', Number(e.currentTarget.value))}
							/>
						</label>

						<label class="slider-row">
							<div class="slider-label">
								<span>Letter Spacing</span>
								<span class="slider-val">{readerSettings.current.letterSpacing}px</span>
							</div>
							<input
								type="range"
								min="-0.5"
								max="4.0"
								step="0.25"
								value={readerSettings.current.letterSpacing}
								oninput={(e) => readerSettings.update('letterSpacing', Number(e.currentTarget.value))}
							/>
						</label>

						<label class="slider-row">
							<div class="slider-label">
								<span>Word Spacing</span>
								<span class="slider-val">{readerSettings.current.wordSpacing}px</span>
							</div>
							<input
								type="range"
								min="0"
								max="8.0"
								step="0.5"
								value={readerSettings.current.wordSpacing}
								oninput={(e) => readerSettings.update('wordSpacing', Number(e.currentTarget.value))}
							/>
						</label>
					</div>

					<h3 class="group-title">Layout</h3>
					<div class="segmented-grid">
						<div class="segment-group">
							<span class="segment-title">Content Width</span>
							<div class="button-group">
								{#each (['narrow', 'normal', 'wide', 'full'] as ContentWidth[]) as w}
									<button
										class="seg-btn"
										class:active={readerSettings.current.contentWidth === w}
										onclick={() => readerSettings.update('contentWidth', w)}
									>
										{w.charAt(0).toUpperCase() + w.slice(1)}
									</button>
								{/each}
							</div>
						</div>

						<div class="segment-group">
							<span class="segment-title">Text Alignment</span>
							<div class="button-group">
								{#each (['left', 'justify', 'center'] as TextAlign[]) as a}
									<button
										class="seg-btn"
										class:active={readerSettings.current.textAlign === a}
										onclick={() => readerSettings.update('textAlign', a)}
									>
										{a.charAt(0).toUpperCase() + a.slice(1)}
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{:else if activeTab === 'colors'}
				<div class="section">
					<h3 class="group-title">Monochrome Palettes</h3>
					<div class="themes-grid">
						{#each AVAILABLE_THEMES as theme}
							<button
								class="theme-card"
								class:active={readerSettings.current.themeId === theme.id}
								style="background: {theme.bg}; color: {theme.text}; border-color: {theme.border};"
								onclick={() => readerSettings.update('themeId', theme.id)}
							>
								<div class="theme-card-header">
									<span class="theme-name">{theme.name}</span>
									{#if readerSettings.current.themeId === theme.id}
										<Check size={14} />
									{/if}
								</div>
								<p class="theme-desc">{theme.description}</p>
							</button>
						{/each}
					</div>

					{#if readerSettings.current.themeId === 'custom'}
						<div class="custom-colors-box">
							<div class="color-pickers-row">
								<label class="color-picker-item">
									<span>Background</span>
									<input
										type="color"
										value={readerSettings.current.customBgColor}
										oninput={(e) => readerSettings.update('customBgColor', e.currentTarget.value)}
									/>
								</label>
								<label class="color-picker-item">
									<span>Text</span>
									<input
										type="color"
										value={readerSettings.current.customTextColor}
										oninput={(e) => readerSettings.update('customTextColor', e.currentTarget.value)}
									/>
								</label>
							</div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'focus'}
				<div class="section">
					<h3 class="group-title">Bionic Reading</h3>
					<div class="toggle-card">
						<div class="toggle-info">
							<span class="toggle-title">Enable Bionic Reading</span>
							<span class="toggle-desc">Bold the first half of words without changing color</span>
						</div>
						<input
							type="checkbox"
							checked={readerSettings.current.bionicEnabled}
							onchange={() => readerSettings.toggleBionic()}
							class="switch-input"
						/>
					</div>

					{#if readerSettings.current.bionicEnabled}
						<label class="slider-row indented">
							<div class="slider-label">
								<span>Fixation Depth</span>
								<span class="slider-val">{Math.round(readerSettings.current.bionicFixation * 100)}%</span>
							</div>
							<input
								type="range"
								min="0.3"
								max="0.7"
								step="0.05"
								value={readerSettings.current.bionicFixation}
								oninput={(e) => readerSettings.update('bionicFixation', Number(e.currentTarget.value))}
							/>
						</label>
					{/if}

					<h3 class="group-title">Visual Focus</h3>
					<div class="toggle-card">
						<div class="toggle-info">
							<span class="toggle-title">Reading Line Ruler</span>
							<span class="toggle-desc">Highlight line guide tracking your cursor</span>
						</div>
						<input
							type="checkbox"
							checked={readerSettings.current.focusRulerEnabled}
							onchange={() => readerSettings.toggleFocusRuler()}
							class="switch-input"
						/>
					</div>

					<div class="toggle-card">
						<div class="toggle-info">
							<span class="toggle-title">Spotlight Mask</span>
							<span class="toggle-desc">Dim content outside the reading line</span>
						</div>
						<input
							type="checkbox"
							checked={readerSettings.current.focusMaskEnabled}
							onchange={() => readerSettings.toggleFocusMask()}
							class="switch-input"
						/>
					</div>

					<div class="toggle-card">
						<div class="toggle-info">
							<span class="toggle-title">Active Paragraph Isolation</span>
							<span class="toggle-desc">Dim non-active paragraphs</span>
						</div>
						<input
							type="checkbox"
							checked={readerSettings.current.highlightActiveParagraph}
							onchange={(e) => readerSettings.update('highlightActiveParagraph', e.currentTarget.checked)}
							class="switch-input"
						/>
					</div>

					<h3 class="group-title">Sensory</h3>
					<div class="toggle-card">
						<div class="toggle-info">
							<span class="toggle-title">Reduced Motion</span>
							<span class="toggle-desc">Disable animations and smooth transitions</span>
						</div>
						<input
							type="checkbox"
							checked={readerSettings.current.reducedMotion}
							onchange={(e) => readerSettings.update('reducedMotion', e.currentTarget.checked)}
							class="switch-input"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 80;
	}

	.settings-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 640px;
		max-width: 92vw;
		max-height: 85vh;
		background: var(--theme-surface, #141414);
		border: 1px solid var(--theme-border, #282828);
		border-radius: 6px;
		color: var(--theme-text, #ffffff);
		z-index: 85;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1.25rem;
		border-bottom: 1px solid var(--theme-border, #282828);
	}

	.header-brand {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.modal-title {
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0;
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

	.settings-tabs {
		display: flex;
		border-bottom: 1px solid var(--theme-border, #282828);
		background: rgba(0, 0, 0, 0.1);
		padding: 0 0.75rem;
		gap: 0.25rem;
		overflow-x: auto;
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.65rem 0.85rem;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		opacity: 0.6;
		white-space: nowrap;
		transition: all 0.12s ease;
	}

	.tab-btn:hover {
		opacity: 0.9;
	}

	.tab-btn.active {
		opacity: 1;
		border-bottom-color: var(--theme-text, #ffffff);
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.group-title {
		font-size: 0.85rem;
		font-weight: 700;
		margin: 0.5rem 0 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.85;
	}

	.presets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 0.5rem;
	}

	.preset-card {
		background: transparent;
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 0.75rem;
		text-align: left;
		cursor: pointer;
		color: inherit;
		transition: all 0.12s ease;
	}

	.preset-card:hover {
		background: rgba(128, 128, 128, 0.1);
		border-color: var(--theme-text, #ffffff);
	}

	.preset-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}

	.preset-name {
		font-weight: 600;
		font-size: 0.88rem;
	}

	.preset-desc {
		font-size: 0.75rem;
		opacity: 0.65;
		margin: 0;
		line-height: 1.35;
	}

	.reset-wrapper {
		margin-top: 0.5rem;
		display: flex;
		justify-content: center;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.85rem;
		background: transparent;
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		color: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.reset-btn:hover {
		background: rgba(128, 128, 128, 0.15);
	}

	.fonts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.5rem;
	}

	.font-card {
		background: transparent;
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 0.65rem 0.75rem;
		text-align: left;
		color: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		transition: all 0.12s ease;
	}

	.font-card:hover {
		background: rgba(128, 128, 128, 0.08);
	}

	.font-card.active {
		border-color: var(--theme-text, #ffffff);
		background: rgba(128, 128, 128, 0.15);
	}

	.font-name {
		font-weight: 600;
		font-size: 0.88rem;
	}

	.font-sample {
		font-size: 0.95rem;
		opacity: 0.8;
	}

	.sliders-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.85rem;
	}

	@media (max-width: 600px) {
		.sliders-grid {
			grid-template-columns: 1fr;
		}
	}

	.slider-row {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.slider-row.indented {
		padding-left: 0.75rem;
	}

	.slider-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.slider-val {
		font-weight: 600;
	}

	input[type='range'] {
		accent-color: var(--theme-text, #ffffff);
		cursor: pointer;
	}

	.segmented-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.85rem;
	}

	@media (max-width: 600px) {
		.segmented-grid {
			grid-template-columns: 1fr;
		}
	}

	.segment-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.segment-title {
		font-size: 0.8rem;
		font-weight: 500;
	}

	.button-group {
		display: flex;
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--theme-border, #282828);
	}

	.seg-btn {
		flex: 1;
		padding: 0.4rem;
		background: transparent;
		border: none;
		border-right: 1px solid var(--theme-border, #282828);
		color: inherit;
		font-size: 0.76rem;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.seg-btn:last-child {
		border-right: none;
	}

	.seg-btn.active {
		background: var(--theme-text, #ffffff);
		color: var(--theme-bg, #000000);
		font-weight: 700;
	}

	.themes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.5rem;
	}

	.theme-card {
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 0.75rem;
		text-align: left;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		transition: all 0.12s ease;
	}

	.theme-card.active {
		outline: 2px solid var(--theme-text, #ffffff);
	}

	.theme-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.theme-name {
		font-weight: 600;
		font-size: 0.85rem;
	}

	.theme-desc {
		font-size: 0.72rem;
		margin: 0;
		line-height: 1.3;
		opacity: 0.7;
	}

	.custom-colors-box {
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 0.75rem;
	}

	.color-pickers-row {
		display: flex;
		gap: 1.5rem;
	}

	.color-picker-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
	}

	.color-picker-item input[type='color'] {
		cursor: pointer;
		border: 1px solid var(--theme-border, #282828);
		width: 28px;
		height: 28px;
		border-radius: 3px;
		background: transparent;
	}

	.toggle-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid var(--theme-border, #282828);
		border-radius: 4px;
		padding: 0.65rem 0.85rem;
	}

	.toggle-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.toggle-title {
		font-weight: 600;
		font-size: 0.85rem;
	}

	.toggle-desc {
		font-size: 0.72rem;
		opacity: 0.65;
	}

	.switch-input {
		width: 18px;
		height: 18px;
		accent-color: var(--theme-text, #ffffff);
		cursor: pointer;
	}
</style>
