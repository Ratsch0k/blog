<script lang="ts">
	import type { Post } from '$lib/post';
	import PostCard from '../post-card.svelte';
	import type { PageLoadData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { FormEventHandler } from 'svelte/elements';

	export let data: PageLoadData;

	const posts: Post[] = data.posts;

	/**
	 * Search query for posts.
	 */
	let search: string | undefined = $page.url.searchParams.get("search") || undefined;

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
	 * Handles user input for the search bar.
	 * 
	 * Updates the url search params.
	 * 
	 * @param event Input event
	 */
	const handleSearchInput: FormEventHandler<HTMLInputElement> = (event) => {
		const query = $page.url.searchParams;
		const search = event.currentTarget.value;

		if (!search) {
			console.log("Remove search")
			query.delete("search");
		} else {
			query.set("search", search);
		}

		goto(`?${query.toString()}`, {keepFocus: true});
	}

	/**
	 * Update the search when the url search params changes.
	 * 
	 * Used for tag links.
	 */
	$: (() => {
		const querySearch = $page.url.searchParams.get("search");

		if (querySearch !== null && querySearch !== search) {
			search = querySearch;
		}
	})()

	$: filteredPosts = (() => {
		// Return unfiltered posts if the user doesn't search		
		if (!search) {
			searchQuery = "";
			return posts;
		}

		searchQuery = search.trim();

		let filteredPosts: Post[] = posts;

		/*
		 * Parse the search query for tags and filter out posts that don't match
		 * the tag.
		 */
		if (searchQuery.startsWith("#")) {
			const possibleTags = searchQuery.split(" ");
			let tags: string[] = [];
			searchQuery = undefined;

			for (let i = 0; i < possibleTags.length; i++) {
				const possibleTag = possibleTags[i];

				if (possibleTag.startsWith("#")) {
					tags.push(possibleTag.slice(1));
				} else {
					searchQuery = possibleTags.slice(i).join(" ");
					break;
				}
			}

			searchedTags = tags;

			filteredPosts = filteredPosts
				.filter((post) => tags.filter((tag) => (post.tags as string[]).includes(tag)).length > 0);
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
					if (post.title.toLowerCase().includes(searchQuery)) {
						return [2, post];
					}
					if (post.description.toLowerCase().includes(searchQuery)) {
						return  [1, post];
					}

					return [0, post];
				}).filter(([prio, _post]) => prio > 0)
				.sort(([prioA, _postA], [prioB, _postB]) => prioA < prioB ? -1 : 1)
				.map(([_prio, post]) => post);
		}
		
		return filteredPosts;
	})();
</script>

<main class="max-w-3xl m-auto px-4">
	<h1 class="text-primary text-5xl italic font-semibold mb-12">All my posts</h1>

	<div class="mb-8">
		<span class="text-sm text-base-100">
			Search for posts. Use # to search for posts with specific tags.
		</span>
		<input on:input={handleSearchInput} type="search" bind:value={search} class="w-full p-2 rounded-lg bg-base-700 border border-base-600 focus-visible:outline focus-visible:outline-base-400" placeholder="Search" id="search-posts"/>
	</div>

	<ul class="flex flex-col space-y-4 justify-stretch">
		{#each filteredPosts as post, i (i)}
			<PostCard {post} highlight={searchQuery} highlightTags={searchedTags} />
		{/each}
	</ul>
</main>
