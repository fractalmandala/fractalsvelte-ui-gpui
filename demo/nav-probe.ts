import '../src/lib/index.ts';
import { mount_headless, screenshot, check, finish, all_text, wait, click_text } from '@fractaldesign/gpuix-fractalsvelte/test';
import Probe from './NavProbe.svelte';

mount_headless(Probe, { width: 640, height: 540 });
await wait(60);
const text = () => all_text().join(' ');
console.log('ALLTEXT:', text());
check('avatars', text().includes('+1') || text().includes('AP'), true);
check('banner', text().includes('A GPUI build is available.'), true);
check('meter value', text().includes('72'), true);
check('table rows', text().includes('mandel.zr') && text().includes('julia.c'), true);
check('status', text().includes('Live'), true);
check('tabs', text().includes('One') && text().includes('Three'), true);
check('breadcrumb', text().includes('Mandelbrot'), true);
check('pagination', text().includes('Page 2') || text().includes('2'), true);
check('stepper', text().includes('Account') && text().includes('Profile'), true);
check('sidenav', text().includes('Files') && text().includes('3'), true);
check('tree', text().includes('Sessions') && text().includes('Trash'), true);
check('kbd', text().includes('⌘K'), true);

// interactions: tab switch, pagination, segmented control, tree expand/collapse
await click_text('Two');
check('tab switched', text().includes('tab=two'), true);
check('segmented shows options', text().includes('Day') && text().includes('Week'), true);
await screenshot(new URL('./nav-shot.png', import.meta.url).pathname);
finish('nav-probe', 14);
