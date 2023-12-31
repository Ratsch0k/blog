---
title: 'Creating a Personal Blog'
publishedAt: '2023-12-28'
description: 'In my first post I will take you through the journey of how I finally made this blog. I will discuss my requirements, the challenges I encountered, and about the solutions I implemented.'
tags:
  - development
---

In my first post, I will take you through the journey of how I finally made a personal blog. I will discuss my requirements, the challenges I encountered, and the solutions I implemented.

# Why

A personal blog is something I wanted to build for a long time but never got around doing.
Alongside my studies, I have always been actively learning and exploring topics in the fields of software development and cyber security.
Either by undertaking smaller and larger projects or by solving security challenges, I'm always eager to expand my horizons as well as gain deep insight into interesting topics.

While showcasing development projects is relatively easy, since you have something visually to show or can simply link the project repository, showcasing knowledge and achievements in security-related topics is more difficult.
Thus, I wanted to build a personal blog to do just that.

# Requirements

My main requirement for this project is that I want to write posts in Markdown and serve them as statically generated HTML files.
This makes writing posts easy and doesn't require a complex and resource-heavy server.

My choice of Javascript framework is [SvelteKit](https://kit.svelte.dev/) with [Typescript](https://www.typescriptlang.org/).
In the past, I usually used [React](https://react.dev/) and was happy with it.
However, since discovering Svelte, I have always wanted to try it and thought that this would be the perfect opportunity.
_Typescript_ is also a must.
While it can be a hassle to type everything, it has saved me hours of debugging on many occasions.

For the posts themselves, there are some must-have features that I think of as essential.

Code snippets are really helpful when showing commands or relevant sections of code.
However, it can become difficult to read without syntax highlighting.
So a must-have are code blocks with syntax highlighting.
A copy button and a small banner that shows the programming languages are also important.
However, I don't think they are as important as syntax highlighting.
Especially, as I don't intend to write guides where these features become really useful.

A table of contents provides a good outline of the current post and an easy way to skip to interesting sections.
While they are helpful without any extras, I personally prefer table of contents that additionally indicate what sections you are currently reading.
A nice implementation of this type of table of contents is used by the _MDN Web Docs_, as can be seen in their [Svelte guide](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_getting_started).
I want to integrate a similar table of contents.
However, instead of highlighting only one section, which can become a little bit confusing and tends to skip small sections, my implementation should highlight every visible section.

[Mermaid](https://mermaid.js.org/) is a brilliant Javascript library that lets you add beautiful diagrams to webpages using a simple syntax.
I often use it to create flow or sequence diagrams to visualize client-server communication or component relationships.
I want to integrate Mermaid into posts so that you can write the diagram code in a Markdown code block, which is then rendered as a diagram on the webpage.

Tags help organize and categorize posts.
By looking at the post's tags, a user can easily decide if it interests them or not.
Thus, integrating tags into posts is a must for me.

Lastly, with a growing number of posts, it can become quite difficult to discover interesting posts or find a specific post.
In such a case, a search bar is essential to avoid user frustration and to make your posts more easily accessible.
A search feature is also the perfect place to integrate the previously mentioned tags.
Someone interested in cybersecurity might not care about software development posts and can simply limit the search to posts with the tag _security_.
My intention is to implement a search bar that lets the user search for tags and text simultaneously.

To summarize, I have the following requirements for this projects.

- Write posts in Markdown
- Create static HTML files
- Use Svelte/SvelteKit
- Code highlighting in code blocks
- Table of contents that highlights the currently visible sections
- Mermaid Diagram
- Tags for post
- Search bar to search for posts and tags

# Design and Project Setup

Let's begin with the fun part.
Building up the project's framework is relatively straight-forward.
The basic idea is to setup a SvelteKit project that builds static HTML files from Markdown files using some kind of preprocessor or generator.

In this section, I will not go into much detail about most topics and focus more on how I build up the project.
In the section [Implementing the requirements](#implementing-the-requirements), I will go into more detail about how I implemented some of the requirements.

## Website Structure

First, let's discuss what the website should look like.
For complex websites, I would usually use tools such as [Figma](https://www.figma.com/) or its open-source alternative, [PenPot](https://penpot.app/), which I can recommend, to draft and design.
However, a blog is not complex and often follows a similar structure.
So I decided against it.

First, the website needs a home page that welcomes the visitor and tells them a little bit about yourself.

Next is an overview of all posts that lists them in a concise manner and lets the user search for posts of interest.
While some blogs like to put this on the home page, I prefer a dedicated page to avoid packing the home page full of content.

Lastly, the website also has to show the posts themselves.
This will often just be the rendered posts with some added styling.

In my blog, the home page should be at the root URL `/`, the post overview at `/posts`, and each post should be under the dynamic URL `/post/[title]` plus their title.
For example, a post called _Creating a Personal Blog_ should be under `/post/creating-a-personal-blog`.

## Project Setup

### Initial Setup

As stated in a previous section, I decided to go with [SvelteKit](https://kit.svelte.dev/).
For the package manager, I chose [pnpm](https://pnpm.io/).

A starter project can be created by running the following command.

```bash
pnpm create svelte@latest blog
```

By default, SvelteKit doesn't build static HTML files.
However, this is one of my requirements.
To change this, I have to tell SvelteKit to prerender all pages.
I can do this by setting the [prerender](https://kit.svelte.dev/docs/page-options#prerender) option in the root layout file.
Add the following line to `src/routes/+layout.ts`.

```typescript
export const prerender = true;
```

Since I know the entire website will be prerendered, I can replace the default adapter with [adapter-static](https://kit.svelte.dev/docs/adapter-static).

When running

```bash
pnpm build
```

SvelteKit will now try to discover all pages, prerender them, and create a static website in the `build` directory.

### Adding Markdown

Next, I somehow have to convert Markdown to HTML.
Writing a parser or converter by hand is not that hard, but time-consuming.
Fortunately, [mdsvex](https://mdsvex.com/) does all the heavy lifting for me.
_Mdsvex_ is a Markdown preprocessor that converts Markdown files into Svelte components.
These Svelte components can then simply be rendered or further converted into HTML files.

Under the hood, mdsvex uses [rehype](https://github.com/rehypejs/rehype) and [remark](https://github.com/remarkjs/remark) from the [unified](https://github.com/unifiedjs) collective to parse Markdown files, preprocess them, and convert them into Svelte components.

Following their [guide](https://mdsvex.com/docs#use-it), I have to add mdsvex as a preprocessor to the svelte configuration in `svelte.config.js`.

```typescript
import mdsvexPkg from 'mdsvex';
const { mdsvex } = mdsvexPkg;

const config = {
	extensions: [
		'.svelte',
		'.md', // Tells svelte to include markdown files
		'.svx'
	],
	preprocess: [mdsvex()]
};
```

While mdsvex has built-in support for some of my requirements, such as _syntax highlighting_ for code blocks, some require additional libraries.
However, now that we can at least handle basic Markdown, let's first set up the routes to render the posts.

### Rendering Posts

As explained in the section [website structure](#website-structure), posts should be accessible under `/post/[title]`.
SvelteKit allows us to implement dynamic routes with _slugs_.
So we'll add the route `/post/[slug]` that fetches the correct Markdown post based on the slug and renders it.
Each post is stored as a Markdown file in their own separate directory, named like their title, in the directory `src/content/posts`.
The route can fetch a post by using a dynamic import.
For example, if you want to import a post called _Creating a personal blog_ which is stored under `src/content/posts/creating-a-personal-blog` from `src/post/[slug]/+layout.ts` you'd have to use a dynamic import like so

```typescript
import { error } from '@sveltejs/kit';
import type { LayoutData } from './$types';

export async function load({ params }): LayoutData {
	try {
		const { default: page, metadata } = await import(
			`../../../content/posts/${params.slug}/index.md`
		);

		return {
			post: page,
			metadata
		};
	} catch (e) {
		throw error(404, 'Post not found');
	}
}
```

The Markdown will be automatically converted into a valid Svelte component by _mdsvex_.

I collect the actual svelte component (the default export of the import) and its metadata (the metadata will contain the post's frontmatter).
I will pass this information to the Svelte component responsible for rendering.
Here, not much must be done.
Simply take the rendered post's svelte component and render it.

```svelte
<script lang="ts">
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
</script>

<svelte:component this={data.post} />
```

Now, if we navigate to `/post/creating-a-personal-blog` the file at `src/content/posts/creating-a-personal-blog/index.md` is rendered.

## Development Workflow

Now that we have a simple example running, let's quickly talk about the development workflow before writing more code.

Consistent code format as well as continuous testing and deployment help detect bugs and inconsistencies before releasing a new version.

I use [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to enforce a consistent code style and build a small Continuous Integration (CI) pipeline to check our code after every push.

As I'm using GitHub to manage my code, I will only focus on [GitHub workflows](https://docs.github.com/en/actions/using-workflows).
Each workflow is a separate YAML file in the `.github/workflows` directory.
Each workflow file defines its environment and what commands to runs.
To check our code style, we only need a simple workflow that sets up Node and runs the eslint and prettier commands.
My file looks like this:

```yml
name: Check format
on: push
jobs:
  check-format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
      - shell: bash
        run: |
          npm install -g pnpm
          pnpm install
          pnpm eslint .
          pnpm prettier --check .
```

### Creating a Release

A blog is nothing if no one can read it.
For such purposes, I'm renting a cloud server from [DigitalOcean](https://www.digitalocean.com/), where I'm also hosting my other websites (e.g. https://simonkurz.de).
Explaining how to setup a server, configure DNS settings, or install [nginx](https://nginx.org/en/) is vastly beyond the scope of this post.
I will simply focus on how I will create a small Continuous Deployment (CD) pipeline that deploys the generated static website to my server.

Since this website doesn't require a custom server, this process is relatively simple.
All I need to do is build the website and copy the files into the correct directory on my server.
Nginx will then simply serve the new files.

For this, I will create a new GitHub workflow file that is triggered when I create a new release.
It builds the project and copies it to the website's directory on my server using _ssh_ and _rsync_.

The deploy job of this workflow looks like this:

```yml
name: Deploy new release
on:
  release:
    types: [released]
jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: check-format
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
      - shell: bash
        env:
          USER: ${{ secrets.USER }}
          SSH_KEY: ${{ secrets.SSH_KEY }}
          TARGET_DIR: ${{ secrets.TARGET_DIR }}
        run: |
          npm install -g pnpm
          pnpm install
          pnpm build
          mkdir -p ~/.ssh/
          touch ~/.ssh/known_hosts
          ssh-keyscan simonkurz.de >> ~/.ssh/known_hosts
          eval $(ssh-agent)
          ssh-add - <<< "$SSH_KEY"
          rsync -e "ssh" --delete -av build/ $USER@simonkurz.de:$TARGET_DIR/
```

Sensitive variables are stored as [GitHub secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
While this should protect the ssh key from malicious eyes, one should always strive for defense in depth.
As an additional measure, I created a new user that is solely used to host the blog and copy the files.
The user has only permission to read and write to the website's directory and nothing else.
This should protect my server even if someone is able to login as that user.
However, I know there could still be ways to escalate privileges.

# Implementing the Requirements

At this point, I have a working starting point, and my development workflow is set up.
Now, I'll tackle my requirements.

I will not get into details on how I will implement tags and the search feature, as they are relatively simple.
Tags are set in the frontmatter of posts, and the search feature is client-side javascript that filters out posts that don't match the search query.

## Syntax Highlighting

While mdsvex has built-in support for syntax highlighting and I'm currently using it, I want to explain my process of how I tried to integrate better syntax highlighting with additional features.

Mdsvex uses [Prism](https://prismjs.com/) to implement syntax highlighting.
While it works and looks good, I am not quite satisfied with its features and plugin system.
I found the amazing rehype plugin [rehype-pretty-code](https://rehype-pretty-code.netlify.app/) which adds beautiful and fine-grained syntax highlighting and has some very helpful features like line highlighting.

However, when I tried disabling syntax highlighting of mdsvex and instead added rehype-pretty-code it added some weird additional characters into the code.
Based on my experiments, it seemed like it escapes the code but doesn't correctly unescape.
The root issue wasn't with rehype-pretty-code but with the underlying syntax highlighting library [shikiji](https://shikiji.netlify.app/guide/).
Even after trying many things, like hooking into the unified pipeline and adding a custom plugin to rewrite the syntax tree, I couldn't fix my issue.
It could be that rehype-pretty-code is working as intended and I was just using it wrong, but since I couldn't get it to work, I decided to stay with Prism.
However, I still intend to replace Prism with rehype-pretty-code in the future.

## Table of Contents

For adding a static table of contents, I can use the rehype plugin [rehype-toc](https://www.npmjs.com/package/rehype-toc) together with [rehype-slug](https://github.com/rehypejs/rehype-slug).
rehype-toc generates the table of contents based on the post's headings.
However, to make the table of contents actually link to the respective heading, rehype-slug must be used, which assigns each heading an id based on its text.
Now, rehype-toc links to the heading, and clicking on an item will scroll to that section.

As stated previously, a static table of contents is nice and all, but I would like to implement one that actually shows which sections the user is currently viewing.
Unfortunately, I couldn't find any library that implements this for me, so I have to do it myself.

My overall approach was as follows.
Each section, so the heading, its text, and every subheading, keeps track of how much of itself is visible.
If a certain percentage is visible, it searches for the table of content entry that links to it and adds a CSS class to the element to highlight the entry.

First, I must wrap each section.
By default, a heading and its content are two different HTML elements.
However, we need to wrap them with one element to accurately keep track of their visibility.
I will use the remark plugin [remark-sectionize](https://www.npmjs.com/package/remark-sectionize) which does exactly this.

Next, I have to add some Javascript to each section to keep track of its visibility.
Here, the first problem is that remark-sectionize uses a simple `section` HTML element to wrap each section.
We have to replace this section element with a custom Svelte component.
However, remark-sectionize doesn't offer this functionality.
Fortunately, we can use mdsvex's [Layout](https://mdsvex.com/docs#layouts) and [Custom Component](https://mdsvex.com/docs#custom-components) features.
The layouts feature allows us to specify a Svelte file that is used by mdsvex to wrap the converted post.
If we export a Svelte component in the layout component with the name of an HTML element (such as `section`), our exported component will replace the HTML element in the rendered.

For example, let's say we have implemented the custom section in file `section.svelte`.
Now, we can export this component in the module script of the layout component.

```svelte
<script context="module">
	import section from './section.svelte';

	export { section, img };
</script>
```

Implementing a component that can keep track of its own visibility is relatively straight forward.
Each sections uses an [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to keep track of its visibility.
If a defined percentage threshold is reached, it adds the CSS class `toc-link-visible` to every link that links to its id by using the query selector \``a[href="#${sectionId}]`\`.

## Additional Features

In contrast to the previously two more complex features, support for Mermaid can be added by using the library [mermaid](https://www.npmjs.com/package/mermaid) and initializing it in the post's layout component.

```typescript
<script lang="ts">
	import mermaid from 'mermaid';
	mermaid.initialize({ startOnLoad: true });

	onMount(() => {
		mermaid.run({ querySelector: '.mermaid' });
  });
</script>
```

At this point, I have implemented all requirements and can focus on some additional nice-to-have features that are simple to add.
I will additionally add support for emojis with [remark-emoji](https://www.npmjs.com/package/remark-emoji) and GitHub-flavored Markdown with [remark-gfm](https://github.com/remarkjs/remark-gfm).

# Further Tasks

My initial requirements have all been implemented and are working as intended.
While the overall project is nowhere near perfect, it is in a state where I can actually deploy the first version and write the first post (this one).

## What is still missing?

Besides that the blog is obviously missing content, I want to add some additional features.

For example, I would like to enhance code blocks with a label that shows the programming language, a copy button that lets the user copy the code to the clipboard, and an optional banner to display a path.
The path banner will most likely be the least often used feature, but I think it can be helpful for guides or posts like this.

The next major addition to the blog are write-ups.
Sometimes when I solve challenges, like _Hack The Box_ machines, I work on active machines or challenges where it is forbidden to publish write-ups.
However, I would still like to make write-ups available to people who have already solved the challenge and know the flags.
Following the initial release of this blog, I will come up with some concepts and ideas for how I could implement such a system.
However, I fear that almost any sensible approach would require a server.

# Conclusion

Creating a personal blog to share my passion for cyber security and software development was a dream I had for years.
Now that I finally undertook the challenge, I'm quite pleased with the results.
While I encountered some challenges, none proved impossible to solve.
I'm really grateful for the [unified collective](https://unifiedjs.com/) and especially for [mdsvex](https://mdsvex.com/).
Without them, it would have been very hard to implement all my requirements, and I wouldn't have been able to create the blog in such a short time.
Hopefully you found this post interesting and will stick with my blog.

See you in my next post. Bye-bye.
