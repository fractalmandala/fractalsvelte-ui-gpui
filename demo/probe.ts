import { mount_headless, finish } from 'gpuix-fractalsvelte/test';
// mount each component directly under a theme wrapper
import DemoButton from '../src/lib/components/core/Button.svelte';
import DemoCard from '../src/lib/components/core/Card.svelte';
import DemoInput from '../src/lib/components/core/Input.svelte';
import DemoTextArea from '../src/lib/components/core/TextArea.svelte';
import DemoCheckbox from '../src/lib/components/core/Checkbox.svelte';
import DemoSwitch from '../src/lib/components/core/Switch.svelte';
import DemoAlert from '../src/lib/components/core/Alert.svelte';
import DemoText from '../src/lib/components/typography/Text.svelte';
import DemoHeading from '../src/lib/components/typography/Heading.svelte';
import DemoDivider from '../src/lib/components/display/Divider.svelte';
import DemoBadge from '../src/lib/components/display/Badge.svelte';
import DemoTag from '../src/lib/components/display/Tag.svelte';
import DemoDot from '../src/lib/components/display/Dot.svelte';
import DemoSpinner from '../src/lib/components/display/Spinner.svelte';
import DemoProgress from '../src/lib/components/display/Progress.svelte';


import DemoSelect from '../src/lib/components/core/Select.svelte';
import DemoMultiSelect from '../src/lib/components/forms/MultiSelect.svelte';
import DemoSearchInput from '../src/lib/components/forms/SearchInput.svelte';
import DemoNumberInput from '../src/lib/components/forms/NumberInput.svelte';
import DemoSlider from '../src/lib/components/forms/Slider.svelte';
import DemoRangeSlider from '../src/lib/components/forms/RangeSlider.svelte';
import DemoTagInput from '../src/lib/components/forms/TagInput.svelte';
import DemoFieldset from '../src/lib/components/forms/Fieldset.svelte';
import DemoFormField from '../src/lib/components/forms/FormField.svelte';

const cases: [string, unknown, Record<string, unknown>][] = [
	['Button', DemoButton, {}],
	['Card', DemoCard, { title: 'T', description: 'D' }],
	['Input', DemoInput, {}],
	['TextArea', DemoTextArea, {}],
	['Checkbox', DemoCheckbox, { checked: true, label: 'x' }],
	['Switch', DemoSwitch, { checked: true }],
	['Alert', DemoAlert, { title: 't', description: 'd' }],
	['Text', DemoText, { children: () => 'x' }],
	['Heading', DemoHeading, { children: () => 'x' }],
	['Divider', DemoDivider, { label: 'l' }],
	['Badge', DemoBadge, { children: () => 'x' }],
	['Tag', DemoTag, { children: () => 'x' }],
	['Dot', DemoDot, {}],
	['Spinner', DemoSpinner, { size: 'text-md' }],
	['Progress', DemoProgress, { value: 50 }],
	['Select', DemoSelect, { options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }] }],
	['MultiSelect', DemoMultiSelect, { options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }], values: [1] }],
	['SearchInput', DemoSearchInput, { value: 'q' }],
	['NumberInput', DemoNumberInput, { value: 5 }],
	['Slider', DemoSlider, { value: 40, showValue: true, label: 'Level' }],
	['RangeSlider', DemoRangeSlider, { from: 10, to: 60, showValue: true, label: 'Range' }],
	['TagInput', DemoTagInput, { tags: ['a', 'b'] }],
	['Fieldset', DemoFieldset, { legend: 'Group' }],
	['FormField', DemoFormField, { label: 'Email', error: 'Required' }]
];

for (const [label, Component, props] of cases) {
	const captured: string[] = [];
	const warn = console.warn;
	console.warn = (...a: unknown[]) => captured.push(a.join(' '));
	try {
		mount_headless(Component as never, { props, width: 300, height: 120 } as never);
	} catch (e) {
		captured.push(`THROWN: ${e}`);
	}
	console.warn = warn;
	const bad = captured.filter((l) => /dropped|no GPUI|zero size|WARN/i.test(l));
	if (bad.length) console.log(`== ${label}\n   ${bad.join('\n   ')}`);
	else console.log(`== ${label}: clean`);
}

finish('probe', cases.length);
