import type { Post } from '$lib/post';
import type { PageLoad } from '../$types';

export const load: PageLoad = async () => {
	const allPosts = await import.meta.glob('../../content/posts/**/*.{svelte,md,svx}');

	const posts: Post[] = await Promise.all(
		Object.entries(allPosts).map(async ([path, resolver]) => {
			const { default: page, metadata } = await resolver();
			const slug = path.replace('../../content/posts', '/post').replace('index.md', '');

			let publishedAt = undefined;

			if ('publishedAt' in metadata) {
				publishedAt = new Date(metadata.publishedAt);
			}

			const post = {
				page,
				metadata,
				path,
				slug,
				publishedAt,
				tags: metadata.tags ?? []
			} satisfies Post;

			return post;
		})
	);

	posts.sort((a, b) => (a.publishedAt < b.publishedAt ? -1 : 1));

	return { posts };
};
