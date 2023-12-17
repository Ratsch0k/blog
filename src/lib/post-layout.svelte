<script context="module">
	import { onMount } from 'svelte';
	// This module script sets up custom components which overwrite elements used in the rendered page.
	// See: https://mdsvex.com/docs#custom-components
	import section from './section.svelte';

	export { section };
</script>

<script lang="ts">
	import mermaid from 'mermaid';
	mermaid.initialize({ startOnLoad: true });

	onMount(() => {
		mermaid.run({ querySelector: '.mermaid' });
	});

	export let title;
	export let publishedAt;

	// Parse the raw publishedAt string into an internationalized date time string
	const publishedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
		Date.parse(publishedAt)
	);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<article class="prose prose-invert">
	<div class="mb-12">
		<h1 class="text-5xl italic mb-2 text-primary font-semibold">{title}</h1>
		<div class="w-full italic text-primary text-sm font-lightd">published on {publishedDate}</div>
	</div>
	<slot />
</article>

<style lang="postcss">
	:global(main.post) {
		@apply flex flex-col;
	}

	/**
   * Styling of the navigation toc.
   */

	:global(.toc) {
		@apply bg-base-800;
		@apply mb-4;
		@apply relative;
	}

	@media (min-width: 1024px) {
		:global(body main.post) {
			display: grid;
			gap: 2rem;
			grid-template-areas: 'space main toc';
			grid-template-columns: minmax(0, 1fr) minmax(0, 3fr) minmax(0, 16rem);
			@apply max-w-[100rem];
			margin: auto;
		}

		:global(body main.post nav) {
			grid-area: toc;
			position: relative;
		}

		:global(body main.post article) {
			grid-area: main;
		}

		:global(.toc) {
			@apply outline-none;
			@apply bg-transparent;
		}

		:global(.toc > .toc-toggle + .toc-toggle-label) {
			display: none;
		}

		:global(.toc > .toc-toggle:checked + .toc-toggle-label + .toc-wrapper) {
			max-height: 100vh;
		}

		:global(.toc > .toc-toggle + .toc-toggle-label + .toc-wrapper) {
			max-height: 100vh;
		}

		:global(.toc .toc-wrapper > .toc-level) {
			@apply border-transparent;
		}

		:global(.toc .toc-wrapper) {
			@apply sticky;
			@apply top-[5rem];
			@apply left-0;
		}

		:global(.toc .toc-wrapper::before) {
			content: 'In this post';
			@apply font-semibold;
			@apply text-lg;
			@apply ml-4;
		}

		:global(.toc .toc-wrapper > ol) {
			@apply border-t;
			@apply rounded-lg;
		}
	}

	:global(.toc-wrapper) {
		@apply overflow-hidden;
		@apply transition-all;
	}

	:global(.toc-toggle:checked + .toc-toggle-label + .toc-wrapper) {
		max-height: 100vh;
	}

	:global(.toc-toggle + .toc-toggle-label + .toc-wrapper) {
		max-height: 0px;
	}

	:global(.toc-toggle) {
		display: none;
	}

	:global(.toc-toggle-label) {
		cursor: pointer;
		@apply font-bold;
		@apply p-3;
		@apply transition-colors;
		width: 100%;
		display: block;
		@apply border;
		@apply border-base-700;
		@apply rounded-lg;
	}

	:global(.toc-toggle-label::before) {
		content: ' ';
		display: inline-block;
		border-top: 5px solid transparent;
		border-bottom: 5px solid transparent;
		border-left: 5px solid currentColor;
		vertical-align: middle;
		margin-right: 0.7rem;
		transform: translateY(-2px);
		transition: transform 0.2s ease-out;
	}

	:global(.toc-toggle:checked + .toc-toggle-label) {
		@apply border-b-transparent;
		@apply rounded-b-none;
	}

	:global(.toc-toggle:checked + .toc-toggle-label::before) {
		transform: rotate(90deg) translateX(-3px);
	}

	:global(.toc-toggle-label:hover) {
		@apply bg-base-700;
		@apply border-base-600;
	}

	:global(.toc-wrapper > ol) {
		@apply p-2;
		@apply border-r;
		@apply border-l;
		@apply border-b;
		@apply border-base-700;
		@apply rounded-b-lg;
		@apply overflow-hidden;
		@apply transition-all;
	}

	:global(.toc-level-1) {
		@apply pt-4;
	}

	:global(.toc-level-2) {
		@apply border-l;
		@apply border-l-base-600;
		@apply pl-2;
	}

	:global(.toc-level-2:has(.toc-link-visible)) {
		@apply border-l-accent;
	}

	:global(.toc-level-3) {
		@apply border-l;
		@apply border-l-base-600;
		@apply ml-1;
		@apply pl-2;
	}

	:global(.toc-level-3:has(.toc-link-visible)) {
		@apply border-l-accent;
	}

	:global(.toc-link-h1) {
		@apply font-semibold;
	}

	:global(.toc-link-visible) {
		@apply bg-base-700;
	}

	:global(.toc-link) {
		@apply p-2;
		@apply w-full;
		@apply block;
		@apply transition-colors;
		@apply rounded-md;
		@apply my-1;
	}

	:global(.toc-link:hover) {
		@apply bg-base-700;
		@apply outline;
		@apply outline-1;
		@apply outline-base-600;
	}

	/* Styling of sections */
	:global(section) {
		@apply mt-4;
		@apply mb-8;
	}

	/* Center mermaid diagrams */
	:global(pre[class='mermaid'] > svg) {
		@apply m-auto;
	}

	/* Center images */
	:global(img) {
		@apply m-auto;
	}

	/*
   * Styling of links in the post
   * Is constraint to links under article to avoid
   * styling the links in the toc.
   */
	:global(article a) {
		@apply text-primary;
		@apply italic;
	}

	:global(article a:hover) {
		@apply underline;
		@apply text-secondary;
	}
</style>
