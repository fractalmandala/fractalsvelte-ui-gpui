import { mount_headless, screenshot, settle, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Probe from './LayoutProbe.svelte';
mount_headless(Probe, { width: 300, height: 120 });
const { wait } = await import('gpuix-fractalsvelte/test');
await wait(50);
await wait(50);
await screenshot(new URL('./layout-shot.png', import.meta.url).pathname);
finish('layout-probe');
