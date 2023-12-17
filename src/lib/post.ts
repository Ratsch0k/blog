export const postTags = ['write-up', 'development', 'security', 'long-term'] as const;
export type PostTag = (typeof postTags)[number];

/**
 * Post object with parsed data.
 *
 * Represents one post and is basically the raw post data just with
 * metadata extracted and parsed into usable data types.
 */
export interface Post {
	/**
	 * The rendered page.
	 */
	page: unknown;
	/**
	 * Relative path where the post markdown files are located.
	 */
	path: string;
	/**
	 * The slug that can be used to navigate to the page.
	 */
	slug: string;
	/**
	 * Raw metadata object.
	 */
	metadata: Record<string, unknown>;
	/**
	 * Date when the post was published.
	 */
	publishedAt: Date | undefined;

	/**
	 * List of tags.
	 */
	tags: PostTag[];
}

/**
 * Raw post data.
 */
export interface RawPost {
	/**
	 * The rendered page.
	 */
	page: unknown;
	/**
	 * Relative path where the post markdown files are located.
	 */
	path: string;
	/**
	 * The slug that can be used to navigate to the page.
	 */
	slug: string;
	/**
	 * Raw metadata object.
	 */
	metadata: Record<string, unknown>;
}

/**
 * Converts a raw post object into a Post
 * @param rawPost The raw post object
 * @returns Raw post object converted into a Post
 */
export function toPost(rawPost: RawPost): Post {
	let publishedAt = undefined;

	if ('publishedAt' in rawPost.metadata) {
		publishedAt = new Date(rawPost.metadata.publishedAt as string);
	}

	return {
		tags: (rawPost.metadata.tags as unknown as PostTag[]) ?? [],
		publishedAt,
		...rawPost
	} satisfies Post;
}
