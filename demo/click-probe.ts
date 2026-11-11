import '../src/lib/index.ts';
import { mount_headless, click_text, click, find_text, all_text, check, finish } from 'gpuix-fractalsvelte/test';
import Probe from './ClickProbe.svelte';

mount_headless(Probe, { width: 300, height: 120 });
await click_text('OFF');
console.log('after click_text:', all_text());
const btn = find_text('OFF') ?? find_text('ON');
if (btn) await click(btn);
console.log('after click:', all_text());
finish('click-probe', 1);
