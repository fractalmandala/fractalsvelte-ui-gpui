import '../src/lib/index.ts';
import { mount_headless, click_at, point_of, find_text, all_text, wait, tree, finish } from 'gpuix-fractalsvelte/test';
import Probe from './SliderProbe.svelte';
mount_headless(Probe, { width: 400, height: 220 });
await wait(60);
const dump = (n, d = 0) => {
	if (d < 6) console.log('  '.repeat(d) + n.type + (n.testId ? `#${n.testId}` : '') + ' ' + JSON.stringify(n.style ?? {}));
	for (const c of n.children ?? []) dump(c, d + 1);
};
const { elements_at } = await import('gpuix-fractalsvelte');
const els = elements_at(339, 66);
console.log('elements_at(339,66):', els.map((e) => `${e.type}${e.nativeId}`).join(', '));
console.log('window click target test');
const { native } = await import('gpuix-fractalsvelte/test');
dump(tree());
finish('slider2', 1);
