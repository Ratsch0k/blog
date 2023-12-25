<script lang="ts" context="module">
	export type Size = 'small' | 'medium' | 'large';
</script>

<script lang="ts">
	/**
	 * Size of the icon.
	 * Either use a predefined size or specify the size in pixels yourself.
	 */
	export let size: Size | number = 'medium';

	const SIZES: Record<Size, number> = {
		small: 16,
		medium: 24,
		large: 32
	};

	$: sizeInPixels = typeof size === 'number' ? size : SIZES[size];
</script>

<div style={`width: ${sizeInPixels}px; height: ${sizeInPixels}px`}>
	<slot />
</div>
