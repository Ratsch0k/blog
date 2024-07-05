<script lang="ts">
	import type { Post } from '$lib/post';
	import { onMount } from 'svelte';

	/**
	 * The post to show.
	 */
	export let post: Post;

	/**
	 * Text to highlight.
	 *
	 * Will highlight text in the description and title that matches this.
	 */
	export let highlight: string | undefined = undefined;

	/**
	 * Tags to highlight.
	 *
	 * Will highlight these tags.
	 */
	export let highlightTags: string[] = [];

	// Component bindings for the spot and container element.
	let spotElement: HTMLDivElement;
	let container: HTMLAnchorElement;
	let card: HTMLDivElement;

	/**
	 * Whether the mouse is currently hovering on the card.
	 */
	let isHovering = false;

	/**
	 * Distance of the container from the top.
	 */
	let containerX: number = 0;

	/**
	 * Distance of the container from the left side.
	 */
	let containerY: number = 0;

	/**
	 * Published date parsed to an internationalized date time format.
	 */
	let publishedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
		post.publishedAt
	);

	/**
	 * Whether the mouse has ever moved or entered the page.
	 *
	 * The spot light element will only be rendered when the mouse has entered the page.
	 * If the mouse has never entered the page, we have no knowledge about the mouse position.
	 * Thus, the spot element would just highlight the area left to the component which would
	 * be visible on the page.
	 */
	let hasMouseMoved = false;

	/**
	 * Register event listener to handle the spot light effect
	 */
	onMount(() => {
		if (container) {
			let rect = container.getBoundingClientRect();
			containerX = rect.left;
			containerY = rect.top;
		}

		if (spotElement) {
			spotElement.style.left = `${-containerX}px`;
			spotElement.style.top = `${-containerY}px`;
		}

		const listener = (event: MouseEvent) => {
			hasMouseMoved = true;
			const newX = -containerX + event.pageX;
			const newY = -containerY + event.pageY;

			spotElement.style.left = `${newX}px`;
			spotElement.style.top = `${newY}px`;
		};

		const handleResize = () => {
			let rect = container.getBoundingClientRect();
			containerX = rect.left;
			containerY = rect.top;
		};

		const onHover = () => {
			isHovering = true;
		};

		const outHover = () => {
			isHovering = false;
		};

		window.addEventListener('mousemove', listener);
		window.addEventListener('resize', handleResize);
		card.addEventListener('mouseenter', onHover);
		card.addEventListener('mouseleave', outHover);

		return () => {
			window.removeEventListener('mousemove', listener);
			window.removeEventListener('resize', handleResize);
			card.removeEventListener('mouseenter', onHover);
			card.removeEventListener('mouseleave', outHover);
		};
	});

	interface HighlightedText {
		text: string;
		highlight?: {
			position: number;
			length: number;
		};
	}

	/**
	 * Get the title and check if there is any section to highlight
	 */
	$: title = (() => {
		const title: HighlightedText = { text: post.title };
		if (!highlight) return title;

		const index = post.title.toLowerCase().indexOf(highlight.toLowerCase());

		if (index < 0) return title;

		title.highlight = {
			position: index,
			length: highlight.length
		};

		return title;
	})();

	/**
	 * Get the description and check if there is any section to highlight
	 */
	$: description = (() => {
		const description: HighlightedText = { text: post.description };
		if (!highlight) return description;

		const index = post.description.toLowerCase().indexOf(highlight.toLowerCase());

		if (index < 0) return description;

		description.highlight = {
			position: index,
			length: highlight.length
		};

		return description;
	})();

	$: tags = post.tags;
</script>

<a
	bind:this={container}
	href={post.slug}
	class:is-hover={isHovering}
	class:not-hover={!isHovering}
	class="hover:no-underline group w-full h-full hover:spot overflow-hidden transition-colors bg-base-700 block p-[1px] rounded-md relative z-10 hover:outline -outline-offset-1 hover:outline-1 hover:outline-base-600"
>
	<div
		bind:this={card}
		class="bg-base-800 group-hover:bg-base-700/90 h-full rounded-md p-4 flex justify-start items-start flex-col z-20 relative transition-colors"
	>
		<span class="font-semibold italic text-2xl">
			{#if !title.highlight}
				{title.text}
			{:else}
				{title.text.slice(0, title.highlight.position)}<mark
					>{title.text.slice(
						title.highlight.position,
						title.highlight.position + title.highlight.length
					)}</mark
				>{title.text.slice(title.highlight.position + title.highlight.length)}
			{/if}
		</span>
		<span class="italic font-extralight text-base-50 mb-2">on {publishedDate}</span>

		<ul class="flex flex-row flex-wrap">
			{#each tags as tag, i (i)}
				<li class="italic text-sm text-base-100 pr-2 hover:underline font-semibold">
					<a href={`/posts?search=${'%23' + tag}`}>
						{#if highlightTags.includes(tag)}
							<mark>
								#{tag}
							</mark>
						{:else}
							#{tag}
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		<span class="text-base-100 mt-2">
			{#if !description.highlight}
				{description.text}
			{:else}
				{description.text.slice(0, description.highlight.position)}<mark
					>{description.text.slice(
						description.highlight.position,
						description.highlight.position + description.highlight.length
					)}</mark
				>{description.text.slice(description.highlight.position + description.highlight.length)}
			{/if}
		</span>
	</div>
	<div
		class:hidden={!hasMouseMoved}
		class="absolute h-[300px] w-[300px] spot rounded-full z-10 -translate-x-1/2 -translate-y-1/2"
		bind:this={spotElement}
	></div>
</a>

<style lang="postcss">
	.spot {
		background: rgb(2, 0, 36);
		background: radial-gradient(circle, var(--color) 0%, rgba(0, 212, 255, 0) 70%);
	}

	.is-hover {
		--color: rgb(151, 228, 201);
	}

	.not-hover {
		--color: rgb(12, 217, 145);
	}

	mark {
		@apply bg-primary;
		@apply rounded-sm;
	}
</style>
