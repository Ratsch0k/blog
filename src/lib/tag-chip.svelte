<script lang="ts">
	import type { PostTag } from './post';
	import SpotlightCard from './spotlight-card.svelte';

	/**
	 * Colors of a tag for the chip
	 */
	interface TagColors {
		/**
		 * The default background color
		 */
		bgColor: string;

		/**
		 * Background color when the user hovers over the chip
		 */
		bgColorHover: string;

		/**
		 * Default border color
		 */
		borderColor: string;

		/**
		 * Border color when the user hovers over the chip
		 */
		borderColorHover: string;

		/**
		 * Default color of the spotlight
		 */
		spotColor: string;

		/**
		 * Color of the spotlight when the user hovers over the element
		 */
		spotColorHover: string;
	}

	/**
	 * Mapping of tag names to their color
	 */
	const COLOR_MAP: Record<PostTag, TagColors> = {
		security: {
			bgColor: '#081b16',
			bgColorHover: '#0d2b22',
			borderColor: '#0d2b22',
			borderColorHover: '#11362B',
			spotColor: '#7affce',
			spotColorHover: '#adffe1'
		},
		'write-up': {
			bgColor: '#280606',
			bgColorHover: '#410b0b',
			borderColor: '#410b0b',
			borderColorHover: '#6f1616',
			spotColor: '#ff2929',
			spotColorHover: '#ff8585'
		},
		development: {
			bgColor: '#191906',
			bgColorHover: '#24240a',
			borderColor: '#2d2d0b',
			borderColorHover: '#424210',
			spotColor: '#ffff24',
			spotColorHover: '#ffffbd'
		},
		series: {
			bgColor: '#0f0f2f',
			bgColorHover: '#101842',
			borderColor: '#16215a',
			borderColorHover: '#273a9b',
			spotColor: '#8985ff',
			spotColorHover: '#ceccff'
		},
		'reverse-engineering': {
			bgColor: '#1a0b23',
			bgColorHover: '#230e2f',
			borderColor: '#39174f',
			borderColorHover: '#542074',
			spotColor: '#c466ff',
			spotColorHover: '#e9c7ff'
		},
		guide: {
			bgColor: '#1f180a',
			bgColorHover: '#271e0c',
			borderColor: '#3e2f14',
			borderColorHover: '#473515',
			spotColor: '#ffaf1a',
			spotColorHover: '#ffcd70'
		}
	};

	/**
	 * Default spotlight card color.
	 *
	 * Used when the tag is not in the mapping.
	 */
	const DEFAULT_COLORS: TagColors = {
		bgColor: '#171717',
		bgColorHover: '#242424',
		borderColor: '#242424',
		borderColorHover: '#3d3d3d',
		spotColor: '#c2c2c2',
		spotColorHover: '#ffffff'
	};

	/**
	 * The tag
	 */
	export let tag: PostTag;

	/**
	 * If tag exists in the mapping, uses the defined colors.
	 * If not, use the default colors.
	 */
	$: tagColor = (() => {
		if (tag in COLOR_MAP) {
			return COLOR_MAP[tag];
		} else {
			return DEFAULT_COLORS;
		}
	})();
</script>

<SpotlightCard {...tagColor}>
	<i class="text-sm font-semibold">#{tag}</i>
</SpotlightCard>
