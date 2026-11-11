import '../src/lib/index.ts';
import { mount_headless, click_text, screenshot, check, finish, all_text } from '@fractaldesign/gpuix-fractalsvelte/test';
import Probe from './OverlayProbe.svelte';

mount_headless(Probe, { width: 600, height: 300 });

check('menu trigger present', all_text().includes('Menu'), true);
await click_text('Menu');
console.log('after menu click:', JSON.stringify(all_text()));
await click_text('Open dialog');
console.log('TEXT:', JSON.stringify(all_text()));
check('dialog body present', all_text().includes('DIALOG IS OPEN'), true);
check('dialog title present', all_text().includes('Delete file'), true);
check('dialog footer present', all_text().includes('Delete'), true);
await screenshot(new URL('./overlay-shot.png', import.meta.url).pathname);
finish('overlay-probe', 4);
