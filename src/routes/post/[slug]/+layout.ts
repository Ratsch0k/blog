import { error } from '@sveltejs/kit';
import type { LayoutData } from './$types';

/**
 * Loads the post that matches the slug.
 */
export async function load({ params }): LayoutData {
	try {
		const { default: page, metadata } = await import(
			`../../../content/posts/${params.slug}/index.md`
		);

		return {
			post: page,
			metadata,
		};
	} catch (e) {
		throw error(404, 'Post not found');
	}
}
