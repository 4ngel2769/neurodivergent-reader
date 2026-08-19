import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listAllDocuments, saveDocument } from '$lib/utils/storage';

const SAMPLE_DOCUMENT_CONTENT = `# Welcome to NeuroRead

Welcome to **NeuroRead**, a clean, minimal reader crafted specifically for neurodivergent minds, people with dyslexia, ADHD, and anyone who values distraction-free reading.

## Core Design

Traditional readers are often cluttered, high-glare, and visually overwhelming. Reading fatigue, crowded letterforms, and drifting focus make deep comprehension difficult.

NeuroRead provides specialized visual tools to eliminate distractions, reduce cognitive load, and enhance focus.

## Features & Focus Tools

### 1. Bionic Reading
Bionic Reading guides your eyes through text using artificial fixation points. By bolding the first half of each word, your brain completes words faster, reducing visual wander and increasing reading speed.

- Toggle it anytime using the **Bionic** button in the top bar (or press \`B\` on your keyboard).
- Adjust the fixation depth in Settings.

### 2. Specialized Typography
We bundle scientifically designed typefaces:
- **Lexend**: Designed to reduce visual stress and expand character spacing for optimal reading fluency.
- **OpenDyslexic**: Features heavy-weighted bottoms to help prevent letter rotation and mirror-flipping (e.g. *b* vs *d*, *p* vs *q*).
- **Atkinson Hyperlegible**: Developed by the Braille Institute to maximize character distinction.
- **Comic Neue**: Friendly, distinct letter shapes widely praised by dyslexic readers.
- **Inter & JetBrains Mono**: Clean neutral sans-serif and monospaced options.

### 3. Reading Ruler & Spotlight Mask
If you find yourself accidentally skipping lines or getting lost on dense text:
- Enable the **Reading Ruler** (\`R\` shortcut) to place a subtle tracking guide over your active line.
- Enable the **Spotlight Mask** to dim surrounding lines, isolating only what you are reading.

### 4. Minimal High-Contrast Palettes
- **Pure Dark**: Pure black background with crisp white text.
- **Pure Light**: Pure white background with deep black text.
- **Soft Dark**: Near-black background with soft grey-white text to reduce glare.
- **Soft Light**: Off-white background with charcoal text for gentle daytime reading.

### 5. Text-to-Speech Companion
Listen to any paragraph with voice synthesis. Use the bottom player bar to step through paragraphs or adjust speech rate.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| \`B\` | Toggle Bionic Reading |
| \`R\` | Toggle Reading Ruler |
| \`S\` | Open Settings |
| \`D\` | Open Library Drawer |
| \`E\` | Toggle Markdown Edit Mode |
| \`Esc\` | Close Modals & Drawers |

Enjoy reading with effortless focus and clarity!`;

export const POST: RequestHandler = async () => {
	try {
		const existingDocs = await listAllDocuments();
		if (existingDocs.length === 0) {
			const sampleDoc = await saveDocument('welcome-guide', SAMPLE_DOCUMENT_CONTENT, 'Welcome to NeuroRead');
			return json({ success: true, seeded: true, document: sampleDoc });
		}
		return json({ success: true, seeded: false });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to seed sample document';
		return json({ success: false, error: message }, { status: 500 });
	}
};
