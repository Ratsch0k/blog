<script lang="ts">
	import type { Post } from '$lib/post';
	import { onMount } from 'svelte';

	export let post: Post;

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
		new Date(post.metadata.publishedAt)
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
</script>

<a
	bind:this={container}
	href={post.slug}
	class:is-hover={isHovering}
	class:not-hover={!isHovering}
	class="hover:no-underline group w-full hover:spot overflow-hidden transition-colors bg-base-700 block p-[1px] rounded-md relative z-10 hover:outline -outline-offset-1 hover:outline-1 hover:outline-base-600"
>
	<div
		bind:this={card}
		class="bg-base-800 group-hover:bg-base-700/90 rounded-md p-4 flex justify-center items-start flex-col z-20 relative h-20 transition-colors"
	>
		<span class="font-semibold italic text-lg">{post.metadata.title}</span>
		<span class="text-sm italic font-extralight text-base-50">on {publishedDate}</span>
	</div>
	<div
		class:hidden={!hasMouseMoved}
		class="absolute h-[300px] w-[300px] spot rounded-full z-10 -translate-x-1/2 -translate-y-1/2"
		bind:this={spotElement}
	></div>
</a>

<style>
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
</style>
