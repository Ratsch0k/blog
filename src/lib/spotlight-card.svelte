<script lang="ts">
	import { onMount } from 'svelte';
	import { mousePosition } from './mouse-position';

	export let bgColor = '#06130F';
	export let bgColorHover = '#0B231C';
	export let borderColor = '#0B231C';
	export let borderColorHover = '#11362B';
	export let spotColor = 'rgba(151, 228, 201)';
	export let spotColorHover = 'rgba(151, 228, 201)';

	// Component bindings for the spot and container element.
	let card: HTMLDivElement;

	/**
	 * Distance of the container from the top.
	 */
	let containerX: number = 0;

	/**
	 * Distance of the container from the left side.
	 */
	let containerY: number = 0;

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
		if (card) {
			let rect = card.getBoundingClientRect();
			containerX = rect.left;
			containerY = rect.top;
		}

		mousePosition().subscribe((position) => {
			hasMouseMoved = position.available;
		});

		const handleResize = () => {
			let rect = card.getBoundingClientRect();
			containerX = rect.left;
			containerY = rect.top;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div
	bind:this={card}
	style={`
		--bg-color: ${bgColor};
		--border-color: ${borderColor};
		--hover-bg-color: ${bgColorHover};
		--hover-border-color: ${borderColorHover};
		--hover-spot-color: ${spotColorHover};
		--spot-color: ${spotColor};
		--container-x: ${containerX}px;
		--container-y: ${containerY}px;
	`}
	class="rounded-full cursor-pointer transition-colors card"
	class:no-spot={!hasMouseMoved}
>
	<div class="inner p-1 px-3">
		<slot />
	</div>
</div>

<style lang="postcss">
	.card {
		--local-x: calc(var(--mouse-x) - var(--container-x));
		--local-y: calc(var(--mouse-y) - var(--container-y));
		background-color: var(--border-color);
		overflow: hidden;
		position: relative;
		padding: 1px;
		@apply transition-colors;
	}

	.card:hover {
		background-color: var(--hover-border-color);
	}

	.card::before {
		background: radial-gradient(
			circle 100px at var(--local-x) var(--local-y),
			var(--spot-color) 0%,
			rgba(0, 0, 0, 0) 70%
		);
		content: ' ';
		width: 100%;
		height: 100%;
		display: block;
		position: absolute;
		top: 0px;
		left: 0px;
		@apply transition-all;
	}

	.card:hover::before {
		background: radial-gradient(
			circle 75px at var(--local-x) var(--local-y),
			var(--hover-spot-color) 0%,
			rgba(0, 0, 0, 0) 70%
		);
	}

	.inner {
		width: 100%;
		height: 100%;
		background-color: var(--bg-color);
		@apply rounded-full;
		position: relative;
		@apply transition-colors;
	}

	.card:hover .inner {
		background-color: color-mix(in srgb, var(--hover-bg-color), transparent 20%);
	}

	.no-spot::before {
		opacity: 0;
	}
</style>
