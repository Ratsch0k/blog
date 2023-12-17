<script lang="ts">
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
</script>

<svelte:component this={data.post} />
