import { mount_headless, screenshot, wheel, all_text, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Demo from './Demo.svelte';

const m = mount_headless(Demo, { width: 720, height: 520 });
const scroller = m.root;

await screenshot(new URL('./page-0.png', import.meta.url).pathname);
for (let i = 1; i <= 5; i++) {
	await wheel(scroller, 0, -480);
	await screenshot(new URL(`./page-${i}.png`, import.meta.url).pathname);
}
console.log(all_text().length, 'text nodes');
finish('pages');
