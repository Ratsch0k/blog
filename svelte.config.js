import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import pkg from 'mdsvex';
const { mdsvex } = pkg;
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import remarkSectionize from 'remark-sectionize';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeExternalLinks from 'rehype-external-links';
import remarkFlexibleCodeTitles from 'remark-flexible-code-titles';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md', '.svx'],

	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			layout: './src/lib/post-layout.svelte',
			remarkPlugins: [remarkSectionize, remarkGfm, remarkEmoji, remarkFlexibleCodeTitles],
			rehypePlugins: [
				[rehypeExternalLinks, { rel: 'noreferrer' }],
				rehypeSlug,
				[
					rehypeToc,
					{
						headings: ['h1', 'h2', 'h3'],
						customizeTOC: (toc) => {
							const navToggle = {
								type: 'element',
								tagName: 'input',
								properties: {
									type: 'checkbox',
									className: 'toc-toggle',
									id: 'toc-toggle'
								}
							};
							const toggleLabel = {
								type: 'element',
								tagName: 'label',
								properties: {
									className: 'toc-toggle-label',
									for: 'toc-toggle'
								},
								children: [
									{
										type: 'text',
										value: 'Table of contents'
									}
								]
							};
							const tocWrapper = {
								type: 'element',
								tagName: 'div',
								properties: {
									className: 'toc-wrapper'
								},
								children: toc.children
							};

							// Remove any preceding non h1 headings
							if (toc.children.length > 0) {
								const rootList = toc.children[0];

								rootList.children = rootList.children.filter((child) => {
									return child.properties.className.includes('toc-item-h1');
								});
							}

							toc.children = [navToggle, toggleLabel, tocWrapper];
						}
					}
				]
			]
		}),
		vitePreprocess()
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({ strict: false })
	}
};

export default config;
