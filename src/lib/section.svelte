<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * The section element.
	 */
	let section: HTMLElement;

	/**
	 * Only if the current section is at least this percentage visible, will it
	 * notify the navigation.
	 *
	 * This is most likely not the final value and further experiments are required
	 * to determine the optimal value.
	 */
	const VISIBILITY_THRESHOLD = 0.0;

	/**
	 * Whether or not the section is visible.
	 */
	let isVisible = false;

	/**
	 * Id of this section.
	 * Retrieved from the first header in the section.
	 */
	let sectionId: string | null = null;

	/**
	 * Sets up an intersection observer to monitor if the the current section
	 * is visible or not.
	 *
	 * Further experiments needed to determine an appropriate threshold.
	 */
	onMount(() => {
		if (!section) {
			return;
		}

		// Get the id of the current section by getting the first element
		// We assume that the first section is always the main heading of the section
		// and its id is the heading id.
		// We can assume this because we use remark-sectionize and rehype-slug
		const heading = section.childNodes[0];
		const headingId = heading.id;
		sectionId = headingId;

		// Now we create the intersection observer to monitor how much of the section is visible.
		// If enough is visible, we will set the visibility variable.
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.length >= 1) {
					let entry = entries.at(0);

					if (!entry) {
						return;
					}

					isVisible = entry.isIntersecting;
				}
			},
			{
				threshold: VISIBILITY_THRESHOLD
			}
		);
		observer.observe(section);

		return () => {
			observer.disconnect();
		};
	});

	/**
	 * Read to change to `isVisible`.
	 * Depending on the value, will notify the corresponding toc element by setting the
	 * class `toc-link-visible` on it.
	 */
	$: (() => {
		if (!sectionId) {
			return;
		}

		const navLink = document.querySelector(`a[href="#${sectionId}"]`);

		if (!navLink) {
			return;
		}

		if (isVisible) {
			navLink.classList.add('toc-link-visible');
		}
		if (!isVisible) {
			navLink.classList.remove('toc-link-visible');
		}
	})();
</script>

<section bind:this={section}>
	<slot />
</section>
