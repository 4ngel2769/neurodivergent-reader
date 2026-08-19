export type ContentWidth = 'narrow' | 'normal' | 'wide' | 'full';
export type TextAlign = 'left' | 'justify' | 'center';

export interface ReaderSettings {
	fontFamily: string;
	fontSize: number;
	lineHeight: number;
	letterSpacing: number;
	wordSpacing: number;
	contentWidth: ContentWidth;
	textAlign: TextAlign;
	themeId: string;
	customBgColor: string;
	customTextColor: string;
	bionicEnabled: boolean;
	bionicFixation: number;
	focusRulerEnabled: boolean;
	focusRulerHeight: number;
	focusMaskEnabled: boolean;
	focusMaskOpacity: number;
	highlightActiveParagraph: boolean;
	reducedMotion: boolean;
	ttsRate: number;
	ttsPitch: number;
	ttsVoice: string;
}

export interface ThemeConfig {
	id: string;
	name: string;
	category: 'light' | 'dark' | 'tinted' | 'high-contrast' | 'custom';
	bg: string;
	text: string;
	accent: string;
	surface: string;
	border: string;
	description: string;
}

export interface FontConfig {
	id: string;
	name: string;
	cssValue: string;
	description: string;
}

export interface DocumentMetadata {
	id: string;
	title: string;
	filename: string;
	sizeBytes: number;
	wordCount: number;
	readingTimeMinutes: number;
	createdAt: string;
	updatedAt: string;
}

export interface DocumentDetail extends DocumentMetadata {
	content: string;
}

export interface HeadingItem {
	level: number;
	text: string;
	id: string;
}

export interface PresetProfile {
	id: string;
	name: string;
	description: string;
	settings: Partial<ReaderSettings>;
}
