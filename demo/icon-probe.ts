import { mount_headless, screenshot, tree, check, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Probe from './IconProbe.svelte';

mount_headless(Probe, { width: 200, height: 100 });
console.log(JSON.stringify(tree(), null, 1).slice(0, 3000));
await screenshot(new URL('./icon-shot.png', import.meta.url).pathname);
finish('icon-probe');
