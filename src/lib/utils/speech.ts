export interface SpeakOptions {
	rate?: number;
	pitch?: number;
	voiceName?: string;
	onStart?: () => void;
	onEnd?: () => void;
	onError?: (error: unknown) => void;
}

export function isSpeechSupported(): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
	if (!isSpeechSupported()) return [];
	return window.speechSynthesis.getVoices();
}

export function stopSpeaking(): void {
	if (!isSpeechSupported()) return;
	window.speechSynthesis.cancel();
}

export function pauseSpeaking(): void {
	if (!isSpeechSupported()) return;
	window.speechSynthesis.pause();
}

export function resumeSpeaking(): void {
	if (!isSpeechSupported()) return;
	window.speechSynthesis.resume();
}

export function cleanTextForSpeech(rawText: string): string {
	return rawText
		.replace(/#+/g, '')
		.replace(/[*_`~[\]()]/g, ' ')
		.replace(/https?:\/\/\S+/g, 'link')
		.replace(/\s+/g, ' ')
		.trim();
}

export function speakText(text: string, options: SpeakOptions = {}): SpeechSynthesisUtterance | null {
	if (!isSpeechSupported()) return null;

	stopSpeaking();

	const cleaned = cleanTextForSpeech(text);
	if (!cleaned) return null;

	const utterance = new SpeechSynthesisUtterance(cleaned);
	utterance.rate = options.rate ?? 1.0;
	utterance.pitch = options.pitch ?? 1.0;

	if (options.voiceName) {
		const voices = getAvailableVoices();
		const matchedVoice = voices.find((v) => v.name === options.voiceName);
		if (matchedVoice) {
			utterance.voice = matchedVoice;
		}
	}

	if (options.onStart) utterance.onstart = options.onStart;
	if (options.onEnd) utterance.onend = options.onEnd;
	if (options.onError) utterance.onerror = options.onError;

	window.speechSynthesis.speak(utterance);
	return utterance;
}
