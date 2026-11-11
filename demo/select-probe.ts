import '../src/lib/index.ts';
import { mount_headless, click_text, click_test_id, click, find_test_id, all_text, wait, check, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Probe from './SelectProbe.svelte';

mount_headless(Probe, { width: 400, height: 300 });
await wait(40);
await click_text('Beta');
await wait(40);
console.log('after open:', all_text());
await click_test_id('select-opt-c');
await wait(40);
console.log('after pick:', all_text());
finish('select-probe', 1);
