<script>
	import './styles.css';
	import './night-owl.css';
	import Header from './header.svelte';
	import Footer from './footer.svelte';
</script>

<div class="app">
	<header class="mb-16">
		<div class="fixed top-0 w-full z-10">
			<Header></Header>
		</div>
	</header>

	<div class="min-h-[100vh]">
		<slot />
	</div>

	<Footer />
</div>
