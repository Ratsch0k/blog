<script lang="ts">
	import { onMount } from 'svelte';
	import Close from './icon/close.svelte';

	/**
	 * Source url for the iamge.
	 */
	export let src: string;

	/**
	 * Alternative text.
	 */
	export let alt: string;

	let dialog: HTMLDialogElement;
	let dialogImage: HTMLImageElement;

	/**
	 * Whether the dialog should be open or not.
	 */
	let open = false;

	/**
	 * Opens the dialog.
	 */
	const openDialog = () => {
		open = true;
		dialog.showModal();
	};

	/**
	 * Closes the dialog.
	 */
	const closeDialog = () => {
		open = false;
		dialog.close();
	};

	/**
	 * Prepares the event listener to enable clickaway on the
	 * dialog image.
	 */
	onMount(() => {
		const dialogOnClick = () => {
			if (open) {
				closeDialog();
			}
		};

		const dialogImageOnClick = (event: MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();
		};

		dialog.addEventListener('click', dialogOnClick);
		dialogImage.addEventListener('click', dialogImageOnClick);

		return () => {
			dialog.removeEventListener('click', dialogOnClick);
			dialogImage.removeEventListener('click', dialogImageOnClick);
		};
	});
</script>

<div class="flex justify-center">
	<button on:click={openDialog}>
		<img {src} {alt} class="rounded-lg border border-base-700 m-auto cursor-pointer" />
	</button>
</div>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<dialog
	tabindex={-1}
	on:close={closeDialog}
	{open}
	bind:this={dialog}
	class:hidden={!open}
	class="w-[100vw] h-[100vh] bg-transparent flex justify-center items-center"
>
	<!-- svelte-ignore a11y-autofocus -->
	<button
		autofocus
		on:click={closeDialog}
		class="absolute top-0 right-0 text-base-50 hover:bg-base-50/20 rounded-md p-2"
		><Close size="large" /></button
	>
	<img bind:this={dialogImage} {src} {alt} class="py-4" />
</dialog>

<style lang="postcss">
	dialog::backdrop {
		@apply bg-base-800/40;
		@apply backdrop-blur-sm;
		width: 100%;
		height: 100%;
	}


	.hidden {
		display: none;
	}
</style>
