import { mount_headless, screenshot, all_text, check, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import Demo from './Demo.svelte';

mount_headless(Demo, { width: 720, height: 520 });

const text = all_text().join('\n');
check('buttons render', text.includes('Primary') && text.includes('Secondary') && text.includes('Danger'), true);
check('badges render', text.includes('Active') && text.includes('Pending') && text.includes('Failed'), true);
check('alerts render', text.includes('Heads up') && text.includes('Saved') && text.includes('Check this'), true);
check('forms render', text.includes('Name') && text.includes('Notifications') && text.includes('Accept the terms'), true);
check('progress renders', text.includes('Uploading') && text.includes('64%'), true);

await screenshot(new URL('./shot.png', import.meta.url).pathname);
finish('demo', 5);
