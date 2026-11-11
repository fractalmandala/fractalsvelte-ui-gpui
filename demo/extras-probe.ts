import '../src/lib/index.ts';
import { mount_headless, screenshot, check, finish, all_text, wait, click_text } from 'gpuix-fractalsvelte/test';
import Probe from './ExtrasProbe.svelte';

mount_headless(Probe, { width: 720, height: 540 });
await wait(60);
const text = () => all_text().join(' ');
check('alert dialog trigger', text().includes('Confirm…'), true);
check('combobox', text().includes('Alpha') || text().includes('Combobox'), true);
check('color picker presets', text().includes('#'), true);
check('pin cells', text().includes('PIN'), true);
check('waveform times', text().includes('0:31') || text().includes('1:30'), true);
check('chat bubbles', text().includes('hey') && text().includes('9:42'), true);
check('empty state', text().includes('No renders yet'), true);
check('features', text().includes('Fast') && text().includes('Safe') && text().includes('Pretty'), true);
check('video placeholder', text().includes('Mandelbrot zoom'), true);
check('blockquote', text().includes('Everything is a class you can read.'), true);
check('collapsible', text().includes('More detail'), true);
check('cards', text().includes('Clickable') && text().includes('Selectable'), true);
check('upload', text().includes('Drop a render'), true);

await click_text('Confirm…');
check('alert dialog opens', text().includes('Delete render?'), true);
await click_text('Delete');
await wait(40);
check('alert dialog closes', !text().includes('Delete render?'), true);

await screenshot(new URL('./extras-shot.png', import.meta.url).pathname);
finish('extras-probe', 15);
