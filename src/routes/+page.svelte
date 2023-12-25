<script lang="ts">
	import type { PageData } from './$types';
	import PostCard from './post-card.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Simon Kurz - Blog</title>
	<meta name="description" content="Simon Kurz Blog - Home" />
</svelte:head>

<main class="w-full mt-20 px-4">
	<div class="max-w-md m-auto mb-12">
		<div class="mb-8">
			<div class="text-6xl font-semibold italic text-primary">Hi there,</div>
			<div class="text-xl font-semibold italic">seems like you found my blog.</div>
		</div>

		I'm a 25 years old IT-Security master's student at the Technical University Darmstadt. My
		passion is to learn about and explore the worlds of
		<i class="highlight">cybersecurity</i> and
		<i class="highlight">software development</i>. This blog is a place for me to share my passion
		with anyone interested. You can expect smaller posts such as challenge
		<i class="highlight">write-ups</i>
		to serieses of posts about longer <i class="highlight">personal projects</i>.
	</div>

	<div class="max-w-3xl m-auto">
		<h3 class="text-3xl italic text-primary font-semibold mb-8">Read my top posts</h3>
		<div class="w-full flex flex-col items-stretch">
			<ul class="flex flex-row space-x-6 flex-wrap items-stretch mb-4">
				{#each data.topPosts as post}
					<li class="flex-1"><PostCard {post} /></li>
				{/each}
			</ul>
			<a
				href="posts"
				class="font-semibold text-primary text-md hover:bg-base-700 m-auto transition-colors p-3 rounded-lg hover:no-underline"
			>
				ALL POST
			</a>
		</div>
	</div>
</main>

<style>
	.highlight {
		@apply text-accent;
	}
</style>
