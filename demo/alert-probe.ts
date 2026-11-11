import { mount_headless, find_test_id, tree, finish } from '@fractaldesign/gpuix-fractalsvelte/test';
import '../src/lib/index.ts';
import Alert from '../src/lib/components/core/Alert.svelte';

mount_headless(Alert, { props: { title: 'Failed', description: 'd', message: 'danger', testid: 'alert' }, width: 400, height: 140 });
const dump = (n) => {
	if (n.testId || n.style?.backgroundColor) console.log(n.testId, JSON.stringify(n.style));
	for (const c of n.children ?? []) dump(c);
};
dump(tree());
const el = find_test_id('alert');
console.log('found:', JSON.stringify(el?.style, null, 1));
finish('alert-probe');
