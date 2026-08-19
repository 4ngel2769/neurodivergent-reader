import type { FontConfig, PresetProfile, ReaderSettings, ThemeConfig } from './types';

export const DEFAULT_SETTINGS: ReaderSettings = {
	fontFamily: 'lexend',
	fontSize: 18,
	lineHeight: 1.8,
	letterSpacing: 0.5,
	wordSpacing: 1.5,
	contentWidth: 'normal',
	textAlign: 'left',
	themeId: 'soft-dark',
	customBgColor: '#121212',
	customTextColor: '#e0e0e0',
	bionicEnabled: true,
	bionicFixation: 0.5,
	focusRulerEnabled: false,
	focusRulerHeight: 40,
	focusMaskEnabled: false,
	focusMaskOpacity: 0.7,
	highlightActiveParagraph: true,
	reducedMotion: false,
	ttsRate: 1.0,
	ttsPitch: 1.0,
	ttsVoice: ''
};

export const AVAILABLE_THEMES: ThemeConfig[] = [
	{
		id: 'pure-dark',
		name: 'Pure Dark',
		category: 'high-contrast',
		bg: '#000000',
		text: '#ffffff',
		accent: '#ffffff',
		surface: '#121212',
		border: '#282828',
		description: 'Pure black background with pure white text and crisp borders'
	},
	{
		id: 'pure-light',
		name: 'Pure Light',
		category: 'high-contrast',
		bg: '#ffffff',
		text: '#000000',
		accent: '#000000',
		surface: '#f5f5f5',
		border: '#e0e0e0',
		description: 'Pure white background with pure black text for maximum contrast'
	},
	{
		id: 'soft-dark',
		name: 'Soft Dark',
		category: 'dark',
		bg: '#141414',
		text: '#d6d6d6',
		accent: '#ffffff',
		surface: '#1e1e1e',
		border: '#2c2c2c',
		description: 'Near-black background with soft grey-white text to reduce glare'
	},
	{
		id: 'soft-light',
		name: 'Soft Light',
		category: 'light',
		bg: '#f7f7f7',
		text: '#1a1a1a',
		accent: '#000000',
		surface: '#ebebeb',
		border: '#dadada',
		description: 'Off-white background with charcoal text for gentle day reading'
	},
	{
		id: 'custom',
		name: 'Custom',
		category: 'custom',
		bg: '#141414',
		text: '#e0e0e0',
		accent: '#ffffff',
		surface: '#1e1e1e',
		border: '#2c2c2c',
		description: 'Custom monochromatic background and text color choice'
	}
];

export const AVAILABLE_FONTS: FontConfig[] = [
	{
		id: 'lexend',
		name: 'Lexend',
		cssValue: "'Lexend', sans-serif",
		description: 'Designed specifically to reduce visual stress and improve reading fluency'
	},
	{
		id: 'opendyslexic',
		name: 'OpenDyslexic',
		cssValue: "'OpenDyslexic', sans-serif",
		description: 'Weighted bottoms to ground letters and prevent rotation/flipping'
	},
	{
		id: 'atkinson',
		name: 'Atkinson Hyperlegible',
		cssValue: "'Atkinson Hyperlegible', sans-serif",
		description: 'Braille Institute font maximizing character distinction'
	},
	{
		id: 'comic-neue',
		name: 'Comic Neue',
		cssValue: "'Comic Neue', cursive, sans-serif",
		description: 'Casual, distinct letterforms widely favored for dyslexia'
	},
	{
		id: 'inter',
		name: 'Inter',
		cssValue: "'Inter', sans-serif",
		description: 'Ultra-clean modern sans-serif with exceptional clarity'
	},
	{
		id: 'mono',
		name: 'JetBrains Mono',
		cssValue: "'JetBrains Mono', monospace",
		description: 'Monospaced fixed width for structured, uniform reading'
	}
];

export const BUILTIN_PRESETS: PresetProfile[] = [
	{
		id: 'dyslexia-boost',
		name: 'Dyslexia Boost',
		description: 'OpenDyslexic, Soft Light, generous line & letter spacing, and bionic reading',
		settings: {
			fontFamily: 'opendyslexic',
			themeId: 'soft-light',
			fontSize: 20,
			lineHeight: 2.1,
			letterSpacing: 1.2,
			wordSpacing: 3.0,
			bionicEnabled: true,
			bionicFixation: 0.5,
			focusRulerEnabled: false,
			focusMaskEnabled: false
		}
	},
	{
		id: 'adhd-focus',
		name: 'ADHD Laser Focus',
		description: 'Lexend, Soft Dark, bionic reading, and spotlight focus mask',
		settings: {
			fontFamily: 'lexend',
			themeId: 'soft-dark',
			fontSize: 19,
			lineHeight: 1.8,
			letterSpacing: 0.5,
			wordSpacing: 1.5,
			bionicEnabled: true,
			bionicFixation: 0.5,
			focusRulerEnabled: true,
			focusMaskEnabled: true,
			focusMaskOpacity: 0.7
		}
	},
	{
		id: 'high-contrast-dark',
		name: 'High Contrast (Pure Dark)',
		description: 'Pure black background with crisp white text and Atkinson Hyperlegible',
		settings: {
			fontFamily: 'atkinson',
			themeId: 'pure-dark',
			fontSize: 21,
			lineHeight: 2.0,
			letterSpacing: 1.0,
			wordSpacing: 2.0,
			bionicEnabled: false,
			focusRulerEnabled: false,
			focusMaskEnabled: false
		}
	},
	{
		id: 'high-contrast-light',
		name: 'High Contrast (Pure Light)',
		description: 'Pure white background with sharp black text and Atkinson Hyperlegible',
		settings: {
			fontFamily: 'atkinson',
			themeId: 'pure-light',
			fontSize: 20,
			lineHeight: 1.9,
			letterSpacing: 0.8,
			wordSpacing: 1.8,
			bionicEnabled: false,
			focusRulerEnabled: false,
			focusMaskEnabled: false
		}
	},
	{
		id: 'minimal-reader',
		name: 'Minimal Clean',
		description: 'Inter font, Soft Dark, clean compact spacing and reduced motion',
		settings: {
			fontFamily: 'inter',
			themeId: 'soft-dark',
			fontSize: 18,
			lineHeight: 1.75,
			letterSpacing: 0.25,
			wordSpacing: 1.0,
			bionicEnabled: false,
			reducedMotion: true,
			focusRulerEnabled: false,
			focusMaskEnabled: false
		}
	},
	{
		id: 'default-reset',
		name: 'Default Settings',
		description: 'Reset all settings back to default',
		settings: DEFAULT_SETTINGS
	}
];
