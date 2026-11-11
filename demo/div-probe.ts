import { mount_headless, click_at, point_of, find_text, all_text, wait, finish } from 'gpuix-fractalsvelte/test';
import Probe from './DivProbe.svelte';
mount_headless(Probe, { width: 300, height: 140 });
await wait(40);
const b = point_of(find_text('clicked 0'));
console.log('at', JSON.stringify(b));
await click_at(Math.round(b.x + 40), Math.round(b.y));
console.log('after:', all_text().join(' '));
finish('div-probe', 1);
