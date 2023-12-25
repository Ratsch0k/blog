<script lang="ts">
	import Icon from './icon.svelte';
	import type { Size } from './icon.svelte';

	export let size: Size | number | undefined = undefined;
</script>

<Icon {size}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
	</svg>
</Icon>
