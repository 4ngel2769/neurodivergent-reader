const STORAGE_KEY_PREFIX = 'neuroread_scroll_';

export function saveScrollPosition(docId: string, scrollY: number): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(`${STORAGE_KEY_PREFIX}${docId}`, String(scrollY));
}

export function loadScrollPosition(docId: string): number {
	if (typeof localStorage === 'undefined') return 0;
	const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${docId}`);
	return saved ? Number(saved) || 0 : 0;
}
