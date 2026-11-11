import '../src/lib/index.ts';
import { mount_headless, all_text, wait, screenshot, finish } from 'gpuix-fractalsvelte/test';
import Probe from './MiniProbe.svelte';
mount_headless(Probe, { width: 400, height: 300 });
await wait(60);
console.log('T:', all_text().join(' '));
await screenshot(new URL('./mini-shot.png', import.meta.url).pathname);
finish('mini', 1);
