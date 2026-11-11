<script lang="ts">
	import Select from '../src/lib/components/core/Select.svelte';
	import MultiSelect from '../src/lib/components/forms/MultiSelect.svelte';
	import SearchInput from '../src/lib/components/forms/SearchInput.svelte';
	import NumberInput from '../src/lib/components/forms/NumberInput.svelte';
	import Slider from '../src/lib/components/forms/Slider.svelte';
	import RangeSlider from '../src/lib/components/forms/RangeSlider.svelte';
	import TagInput from '../src/lib/components/forms/TagInput.svelte';
	import Fieldset from '../src/lib/components/forms/Fieldset.svelte';
	import FormField from '../src/lib/components/forms/FormField.svelte';

	const options = [
		{ value: 'a', label: 'Alpha' },
		{ value: 'b', label: 'Beta' },
		{ value: 'c', label: 'Gamma', group: 'Set 2' }
	];
	let picked = $state('b');
	let pickedMulti = $state(['a']);
	let search = $state('fra');
	let num = $state(7);
	let level = $state(40);
	let range = $state({ from: 10, to: 60 });
	let tags = $state(['svelte', 'gpui']);
</script>

<div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; width: 100%; height: 100%;">
	<Fieldset legend="Fieldset group">
		<FormField label="Pick one" required helperText="The canonical field wrapper">
			<Select bind:value={picked} {options} />
		</FormField>
		<MultiSelect bind:values={pickedMulti} {options} label="Pick many" />
		<SearchInput bind:value={search} listenForShortcut />
		<NumberInput bind:value={num} min={0} max={10} />
		<Slider bind:value={level} showValue label="Level" min={0} max={100} />
		<RangeSlider bind:from={range.from} bind:to={range.to} showValue label="Range" />
		<TagInput bind:tags label="Tags" />
	</Fieldset>
	<div style="display: flex; gap: 8px;">
		<div testid="state" style="color: red; font-size: 11px;">{picked} {pickedMulti.join(',')} {search} {num} {level} {range.from}-{range.to} {tags.join(',')}</div>
	</div>
</div>
