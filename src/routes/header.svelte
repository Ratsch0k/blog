<script lang="ts">
	import linkedIn from '$lib/assets/In-White-96@2x.png';
	import github from '$lib/assets/github-mark-white.png';
</script>

<div class="w-full p-4 bg-base-900/20 backdrop-blur-md text-primary">
	<span class="text-xl font-bold">
		<a class="hover:no-underline" href="/">Simon Kurz</a>
		<div class="flex flex-row float-right space-x-2">
			<a href="https://de.linkedin.com/in/simon-kurz-888304142" target="_blank" rel="noreferrer"
				><img alt="LinkedIn Logo" src={linkedIn} /></a
			>
			<a href="https://github.com/Ratsch0k" target="_blank" rel="noreferrer"
				><img alt="GitHub Logo" src={github} /></a
			>
		</div>
	</span>
</div>

<style>
	img {
		height: 1.5rem;
	}
</style>
