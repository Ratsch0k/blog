<script lang="ts">
	import PostCard from '../post-card.svelte';
	import type { PageLoadData } from './$types';

	export let data: PageLoadData;
</script>

<main class="max-w-lg m-auto">
	<h1 class="text-primary text-5xl italic font-semibold mb-12">All my posts</h1>
	<ul class="flex flex-col space-y-4 justify-stretch">
		{#each data.posts as post, i (i)}
			<PostCard {post} />
		{/each}
	</ul>
</main>
