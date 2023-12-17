import { toPost, type Post } from '$lib/post';
import type { PageLoad } from './types';

/**
 * List of top posts.
 */
const TOP_POSTS = ['example-post'];

/**
 * Loads the list of top posts.
 */
export const load: PageLoad = async () => {
	const topPosts: Post[] = await Promise.all(
		TOP_POSTS.map(async (name) => {
			const path = `../content/posts/${name}/index.md`;
			const { default: page, metadata } = await import(`../content/posts/${name}/index.md`);
			const slug = path.replace('../content/posts', '/post').replace('index.md', '');

			return toPost({ slug, path, page, metadata });
		})
	);

	return { topPosts };
};
