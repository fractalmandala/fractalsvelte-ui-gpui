import { mount_headless, click_text, screenshot, check, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Demo from './Demo.svelte';

mount_headless(Demo, { width: 720, height: 520 });
await click_text('Dark');
await screenshot(new URL('./dark.png', import.meta.url).pathname);
finish('dark');
