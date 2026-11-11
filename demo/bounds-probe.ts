import { mount_headless, bounds, find_text, check, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Demo from './Demo.svelte';

mount_headless(Demo, { width: 720, height: 520 });

for (const t of ['Name', 'Ada Lovelace', 'Bio', 'Workspace', 'Accept the terms', 'Notifications', 'Heads up', 'Saved', 'Uploading']) {
	const el = find_text(t);
	const b = el ? bounds(el) : null;
	console.log(t, JSON.stringify(b));
}
finish('bounds');
