import { DEFAULT_SETTINGS, BUILTIN_PRESETS } from '../constants';
import type { ReaderSettings } from '../types';

const STORAGE_KEY = 'neuroread_reader_settings_v1';

function loadStoredSettings(): ReaderSettings {
	if (typeof window === 'undefined') {
		return { ...DEFAULT_SETTINGS };
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return { ...DEFAULT_SETTINGS, ...parsed };
		}
	} catch (error) {
		console.warn('Could not load settings from localStorage:', error);
	}

	return { ...DEFAULT_SETTINGS };
}

function persistSettings(settings: ReaderSettings): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (error) {
		console.warn('Could not save settings to localStorage:', error);
	}
}

class SettingsStore {
	current = $state<ReaderSettings>(loadStoredSettings());

	constructor() {
		if (typeof window !== 'undefined') {
			$effect.root(() => {
				$effect(() => {
					persistSettings(this.current);
				});
			});
		}
	}

	update<K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) {
		this.current[key] = value;
		persistSettings(this.current);
	}

	setMultiple(partial: Partial<ReaderSettings>) {
		this.current = { ...this.current, ...partial };
		persistSettings(this.current);
	}

	applyPreset(presetId: string) {
		const preset = BUILTIN_PRESETS.find((p) => p.id === presetId);
		if (preset) {
			this.current = { ...this.current, ...preset.settings };
			persistSettings(this.current);
		}
	}

	reset() {
		this.current = { ...DEFAULT_SETTINGS };
		persistSettings(this.current);
	}

	toggleBionic() {
		this.current.bionicEnabled = !this.current.bionicEnabled;
		persistSettings(this.current);
	}

	toggleFocusRuler() {
		this.current.focusRulerEnabled = !this.current.focusRulerEnabled;
		persistSettings(this.current);
	}

	toggleFocusMask() {
		this.current.focusMaskEnabled = !this.current.focusMaskEnabled;
		persistSettings(this.current);
	}
}

export const readerSettings = new SettingsStore();
