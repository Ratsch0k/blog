<script lang="ts">
	import linkedIn from '$lib/assets/In-White-96@2x.png';
	import github from '$lib/assets/github-mark-white.png';
	import SKLogo from '$lib/icon/sk-logo.svelte';
</script>

<div class="w-full p-2 bg-base-900/20 backdrop-blur-md text-primary">
	<span class="text-xl font-bold flex flex-row items-center justify-between">
		<a class="hover:no-underline flex flex-row items-center space-x-1" href="/">
			<span class="text-primary">
				<SKLogo size={38} />
			</span>
			<span> Simon Kurz </span>
		</a>
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
