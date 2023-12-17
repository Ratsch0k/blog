<script>
	import { page } from '$app/stores';
</script>

<div class="max-w-lg m-auto mt-4">
	<h1 class="text-base-100 italic font-semibold">
		{$page.status} - {$page.error?.message}
	</h1>

	<p class="text-base-200 text-lg">
		{#if $page.status === 404}
			Sorry, the post doesn't exist.
		{:else}
			Sorry, something unexpected happened.
		{/if}
	</p>
</div>
