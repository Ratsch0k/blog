<script lang="ts">
	import type { Post, PostTag } from '$lib/post';
	import PostCard from '../post-card.svelte';
	import type { PageLoadData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { FormEventHandler, KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';
	import Clear from '$lib/icon/close.svelte';
	import Search from '$lib/icon/search.svelte';
	import { postTags } from '$lib/post';
	import { onMount } from 'svelte';

	export let data: PageLoadData;

	/**
	 * The raw list of posts.
	 */
	const posts: Post[] = data.posts;

	/**
	 * The search input element.
	 */
	let input: HTMLInputElement;

	/**
	 * The div arond the search bar and tag dropdown.
	 */
	let searchContainer: HTMLDivElement;

	/**
	 * Search query for posts.
	 */
	let search: string = $page.url.searchParams.get('search') || '';

	/**
	 * Text-based search query.
	 *
	 * Will not contain parts of the search that specify tags.
	 */
	let searchQuery: string | undefined = undefined;

	/**
	 * List of tags the user searches for.
	 */
	let searchedTags: string[] = [];

	/**
	 * Information about a focused tag.
	 */
	interface TagFocus {
		/**
		 * The tag name.
		 */
		tag: string;

		/**
		 * Start position of the tag within the text of the search input.
		 */
		start: number;

		/**
		 * End position of the tag within the text of the search input.
		 */
		end: number;
	}

	/**
	 * The currently focused tag.
	 * If no tag is in focus, this variable will be null.
	 *
	 * Focused tag means that the user is set the caret position in the search bar to
	 * be in or at tag.
	 */
	let focusedTag: TagFocus | null = null;

	/**
	 * Sets up a cick aways listener for the show tags dropdown
	 */
	onMount(() => {
		const onClickHandler = (event: MouseEvent) => {
			if (
				!searchContainer.contains(event.currentTarget as Node | null) &&
				!event.defaultPrevented
			) {
				focusedTag = null;
			}
		};

		document.addEventListener('click', onClickHandler);

		return () => {
			document.removeEventListener('click', onClickHandler);
		};
	});

	/**
	 * Update the url search query with the given newSearch
	 * as search query.
	 * @param newSearch The search query
	 */
	const updateSearchQuery = (newSearch: string) => {
		const query = $page.url.searchParams;

		if (!newSearch) {
			query.delete('search');
		} else {
			query.set('search', newSearch);
		}

		search = newSearch;
		goto(`?${query.toString()}`, { keepFocus: true });
	};

	/**
	 * Check if the given caret position is within a tag.
	 * If yes, returns the tag as a TagFocus.
	 * If no, returns null.
	 * @param caretPosition The caret position within the input
	 * @returns The tag the caret is in or null
	 */
	const checkIfCaretInTag = (caretPosition: number): TagFocus | null => {
		let isCaretInTag = false;
		let start = -1;

		for (let currentLookPos = 0; currentLookPos <= caretPosition; currentLookPos++) {
			const currentChar = search.at(currentLookPos);

			if (currentChar === ' ' && currentLookPos != caretPosition) {
				isCaretInTag = false;
				continue;
			}

			if (currentChar === '#') {
				isCaretInTag = true;
				start = currentLookPos;
				continue;
			}

			if (!isCaretInTag) {
				return null;
			}
		}

		if (start === -1 || !isCaretInTag) {
			return null;
		}

		let end = search.length;
		for (let currentLookPos = caretPosition; currentLookPos < search.length; currentLookPos++) {
			const currentChar = search.at(currentLookPos);

			if (currentChar === ' ') {
				end = currentLookPos;
				break;
			}
		}

		return {
			start,
			end,
			tag: search.slice(start, start + end)
		};
	};

	/**
	 * Hanles an key down event for the search input.
	 * @param ev
	 */
	const handleInputKeydown: KeyboardEventHandler<HTMLInputElement> = (ev) => {
		let currentCursorPos = ev.currentTarget.selectionStart || 0;

		if (ev.code === 'ArrowLeft') {
			currentCursorPos -= 1;
		} else if (ev.code === 'ArrowRight') {
			currentCursorPos += 1;
		}

		/**
		 * This delay ensuer that the typed character is already set in the search variable..
		 *
		 */
		setTimeout(() => {
			focusedTag = checkIfCaretInTag(currentCursorPos);
		}, 0);
	};

	/**
	 * Handles user input for the search bar.
	 *
	 * Updates the url search params.
	 *
	 * @param event Input event
	 */
	const handleSearchInput: FormEventHandler<HTMLInputElement> = (event) => {
		const newSearch = event.currentTarget.value;

		updateSearchQuery(newSearch);
	};

	const handleInputClick: MouseEventHandler<HTMLInputElement> = (event) => {
		event.preventDefault();
		focusedTag = checkIfCaretInTag(event.currentTarget.selectionStart || 0);
	};

	/**
	 * Clear the search query.
	 */
	const clearSearch = () => {
		search = '';
		showTags = false;

		const query = $page.url.searchParams;
		query.delete('search');
		goto(`?${query.toString()}`);
	};

	/**
	 * Handles when the user clicks on a tag in the show tags dropdown.
	 * @param tag The selected tag
	 */
	const handleSelectTag = (tag: PostTag) => {
		if (focusedTag) {
			const newSearch =
				search.slice(0, focusedTag.start) + '#' + tag + search.slice(focusedTag.end);
			showTags = false;
			updateSearchQuery(newSearch);
			input.focus();
		}
	};

	/**
	 * Update the search when the url search params changes.
	 *
	 * Used for tag links.
	 */
	$: (() => {
		const querySearch = $page.url.searchParams.get('search');

		if (querySearch !== null && querySearch !== search) {
			search = querySearch;
		}
	})();

	$: filteredPosts = (() => {
		// Return unfiltered posts if the user doesn't search
		if (!search) {
			searchQuery = '';
			searchedTags = [];
			return posts;
		}

		searchQuery = search.trim();

		let filteredPosts: Post[] = posts;

		/*
		 * Parse the search query for tags and filter out posts that don't match
		 * the tag.
		 */
		if (searchQuery.startsWith('#')) {
			const possibleTags = searchQuery.split(' ');
			let tags: string[] = [];
			searchQuery = undefined;

			for (let i = 0; i < possibleTags.length; i++) {
				const possibleTag = possibleTags[i];

				if (possibleTag.startsWith('#')) {
					tags.push(possibleTag.slice(1));
				} else {
					searchQuery = possibleTags.slice(i).join(' ');
					break;
				}
			}

			searchedTags = tags;

			filteredPosts = filteredPosts.filter(
				(post) => tags.filter((tag) => (post.tags as string[]).includes(tag)).length > 0
			);
		}

		/*
		 * Filter out posts that don't contain the search query in the title or description.
		 * Additionally sort the posts such that posts where the search query is in the title
		 * are higher that the ones where the search query is only found in the description.
		 */
		if (searchQuery !== undefined) {
			searchQuery = searchQuery.toLowerCase();

			filteredPosts = filteredPosts
				.map<[number, Post]>((post) => {
					if (post.title.toLowerCase().includes(searchQuery as string)) {
						return [2, post];
					}
					if (post.description.toLowerCase().includes(searchQuery as string)) {
						return [1, post];
					}

					return [0, post];
				})
				.filter(([prio, _post]) => prio > 0)
				.sort(([prioA, _postA], [prioB, _postB]) => (prioA < prioB ? -1 : 1))
				.map(([_prio, post]) => post);
		}

		return filteredPosts;
	})();
</script>

<main class="max-w-3xl m-auto px-4">
	<h1 class="text-primary text-5xl italic font-semibold mb-12">All my posts</h1>

	<div class="mb-8">
		<span class="text-sm text-base-100 mb-0.5">
			Search for specific posts. You can also search for posts with a specific tag like so: <code
				>#tag1 query</code
			>
		</span>
		<div bind:this={searchContainer}>
			<div
				class="w-full p-2 rounded-lg bg-base-700 border border-base-600 focus-within:outline focus-within:outline-base-400 flex flex-row items-center space-x-2"
			>
				<span class="text-base-100">
					<Search />
				</span>
				<input
					bind:this={input}
					value={search}
					on:input={handleSearchInput}
					on:keydown={handleInputKeydown}
					on:click={handleInputClick}
					type="search"
					class="flex-1 bg-transparent focus-visible:outline-none"
					placeholder="Search"
					id="search-posts"
				/>
				<button
					class="hover:bg-base-600 p-1 rounded-lg text-base-100"
					on:click={clearSearch}
					aria-label="Clears the search bar"
				>
					<Clear />
				</button>
			</div>
			<div
				class=" bg-base-600 mt-2 rounded-lg border border-base-500 absolute z-20"
				class:hidden={!focusedTag}
			>
				<ul class="flex flex-col py-2">
					<i class="font-semibold text-sm px-2 text-base-100">Available Tags</i>
					{#each postTags as tag, i (i)}
						<button
							on:click={() => handleSelectTag(tag)}
							class="p-1 mx-1 text-left rounded-md hover:bg-base-500 cursor-pointer">{tag}</button
						>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<ul class="flex flex-col space-y-4 justify-stretch">
		{#if filteredPosts.length <= 0}
			<i class=" text-base-100 font-semibold text-lg"
				>Sorry, I don't have a post that matches your query...</i
			>
		{:else}
			{#each filteredPosts as post, i (i)}
				<PostCard {post} highlight={searchQuery} highlightTags={searchedTags} />
			{/each}
		{/if}
	</ul>
</main>

<style>
	.hidden {
		display: none;
	}
</style>
