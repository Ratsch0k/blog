<script context="module">
	// This module script sets up custom components which overwrite elements used in the rendered page.
	// See: https://mdsvex.com/docs#custom-components
	import section from './section.svelte';
	import img from './img.svelte';

	export { section, img };
</script>

<script>
	import mermaid from 'mermaid';
	import TagChip from './tag-chip.svelte';
	import { mousePosition } from './mouse-position';
	import { onMount } from 'svelte';
	mermaid.initialize({ startOnLoad: true });

	let article = null;

	onMount(() => {
		mermaid.run({ querySelector: '.mermaid' });
		mousePosition().subscribe((pos) => {
			if (article === null) {
				return;
			}

			article.style.setProperty('--mouse-x', `${pos.x}px`);
			article.style.setProperty('--mouse-y', `${pos.y}px`);
		});
	});
	onMount(() => {
		const codeBlocks = document.querySelectorAll('div[class="remark-code-container"]');

		for (const codeBlock of codeBlocks) {
			const codeContainer = codeBlock.querySelector('pre');
			let language = 'unknown';
			if (codeContainer) {
				language = codeContainer.className.replace('language-', '');
			}

			const languageElement = document.createElement('div');
			languageElement.className = 'remark-code-language';
			languageElement.innerText = language;

			const actionElement = document.createElement('div');
			actionElement.className = 'remark-code-action';

			const code = codeContainer?.innerText;
			const copyElement = document.createElement('button');
			copyElement.className = 'remark-code-copy';
			copyElement.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="margin-top:-4px;height:20px;width:20px;display:inline" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/></svg> ';
			const copyLabel = document.createElement('span');
			copyLabel.innerText = 'Copy';
			copyElement.appendChild(copyLabel);

			copyElement.addEventListener('click', () => {
				if (code) {
					navigator.clipboard.writeText(code);
					copyLabel.innerText = 'Copied';

					setTimeout(() => {
						copyLabel.innerText = 'Copy';
					}, 5000);
				}
			});

			actionElement.appendChild(copyElement);
			if (language !== 'undefined') {
				actionElement.appendChild(languageElement);
			}

			if (codeBlock.firstChild.classList.contains('remark-code-title')) {
				const title = codeBlock.firstChild;

				title?.appendChild(actionElement);
			} else {
				let codeContainerWrapper = codeContainer?.parentElement;

				codeContainerWrapper?.prepend(actionElement);
			}
		}
	});

	export let title;
	export let publishedAt;
	export let tags;

	// Parse the raw publishedAt string into an internationalized date time string
	const publishedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
		Date.parse(publishedAt)
	);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<article class="prose prose-invert" bind:this={article}>
	<div class="mb-12">
		<h1 class="text-5xl italic mb-2 text-primary font-semibold">{title}</h1>
		<div class="w-full italic text-primary font-lightd">published on {publishedDate}</div>

		<h3 class="text-primary mt-4">Tags</h3>
		<ul class="flex flex-row flex-wrap items-center text-gray-300 list-none m-0">
			{#each tags as tag, i (i)}
				<li class="p-1"><TagChip {tag} /></li>
			{/each}
		</ul>
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

	:global(.toc-link:has(~ ol .toc-link-visible)) {
		@apply bg-base-700;
	}

	:global(.toc-link) {
		@apply p-2;
		@apply w-full;
		@apply block;
		@apply outline-transparent;
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
	:global(article a:not(.tag)) {
		@apply text-primary;
		@apply italic;
	}

	:global(article a:not(.tag):hover) {
		@apply underline;
		@apply text-secondary;
	}

	/* Styling of lists */
	:global(article ul) {
		@apply ml-6;
		list-style: disc;
	}

	/* Styling of collapsable details */
	:global(details) {
		@apply px-2;
		@apply py-2;
		@apply border;
		@apply border-base-600;
		@apply bg-base-700;
		@apply rounded-xl;
		@apply my-4;
	}

	:global(summary) {
		@apply cursor-pointer;
		@apply text-base-300;
		@apply font-bold;
	}

	/* Styling of tables */
	:global(table) {
		border-collapse: separate;
		border-spacing: 0px;
		@apply w-full;
		@apply my-4;
	}

	:global(td, tr) {
		@apply p-1.5;
	}

	:global(td) {
		@apply border-b;
		@apply border-base-600;
		@apply border-r;
		@apply bg-base-800;
	}

	:global(tr td:first-child) {
		@apply border-l;
	}

	:global(thead > tr th) {
		@apply bg-base-700;
	}

	:global(thead > tr th:first-child) {
		@apply rounded-tl-lg;
	}

	:global(thead > tr th:last-child) {
		@apply rounded-tr-lg;
	}

	:global(tbody > tr:last-child td:first-child) {
		@apply rounded-bl-lg;
	}

	:global(tbody > tr:last-child td:last-child) {
		@apply rounded-br-lg;
	}

	:global(th) {
		@apply py-2;
		@apply text-base-200;
		@apply border-r;
		@apply border-b;
		@apply border-t;
		@apply border-base-500;
	}

	:global(tr th:first-child) {
		@apply border-l;
	}

	:global(.remark-code-container) {
		position: relative;
		@apply my-2;
	}

	:global(pre[class*='language-']) {
		min-height: 80px;
		display: flex;
		align-items: center;
	}

	:global(.remark-code-container .remark-code-action) {
		position: absolute;
		@apply top-2;
		@apply right-2;
		display: flex;
		margin-right: -3px;
		justify-items: center;
		margin-top: -3px;
		@apply font-semibold;
		@apply text-base-100;
	}

	:global(.remark-code-copy) {
		@apply bg-base-700;
		@apply border;
		@apply border-base-600;
		@apply rounded-md;
		@apply p-0.5;
		@apply px-3;
	}

	:global(.remark-code-copy:hover) {
		@apply bg-base-600;
	}

	:global(.remark-code-language) {
		@apply ml-2;
		@apply bg-base-700;
		@apply border;
		@apply border-base-600;
		@apply rounded-md;
		@apply font-semibold;
		@apply italic;
	}

	:global(.remark-code-container > .remark-code-language) {
		position: absolute;
		@apply p-1;
		@apply px-3;
	}

	:global(.remark-code-container .remark-code-language) {
		@apply p-0.5;
		@apply px-3;
	}
</style>
