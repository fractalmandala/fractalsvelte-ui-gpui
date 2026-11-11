import '../src/lib/index.ts';
import { mount_headless, screenshot, check, finish, all_text, wait, click_text, click_at, click_test_id } from 'gpuix-fractalsvelte/test';
import Probe from './FormsProbe.svelte';
console.log('---- compiled FormsProbe ----');


mount_headless(Probe, { width: 480, height: 540 });
await wait(60);

const text = () => all_text().join(' ');
check('select shows selection', text().includes('Beta'), true);
check('multiselect shows selection', text().includes('Alpha'), true);
check('search shows value', text().includes('fra'), true);
check('number shows value', text().includes('7'), true);
check('slider shows value', text().includes('40'), true);
check('range shows values', text().includes('10 – 60'), true);
check('tags render', text().includes('svelte') && text().includes('gpui'), true);

// interactions
await click_text('Beta'); // open the select's popover
check('select popover open', text().includes('Gamma'), true);
await click_test_id('select-opt-c');
await wait(40);
check('select picked gamma', text().includes('Gamma') && !text().includes('Beta'), true);

await click_test_id('num-inc'); // number stepper
check('number stepped', text().includes('8'), true);

// slider: click at ~80% of the track
const { point_of, find_text } = await import('gpuix-fractalsvelte/test');const track = find_text('Level'); // the label row above the track; aim at the track row under it
const b = point_of(track);
await click_at(b.x + 340, Math.round(b.y + 21));
await wait(60);
await wait(60);
check('slider dragged to a new value', !text().includes('Level 40'), true);
await screenshot(new URL('./forms-shot.png', import.meta.url).pathname);
finish('forms-probe', 11);
