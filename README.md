# Personal Blog
Website of my personal blog written with [sveltekit](https://kit.svelte.dev/).

Posts are written in markdown and converted into html using [mdsvex](https://mdsvex.com/) to create a static website.

The project is nowhere near final.
Therefore, the exact structure is subject to change.

## Posts
The markdown files of all posts are stored in `src/content`.
Each post has its own folder and the folder name is used as a slug to navigate to it.
The blog's markdown file should be named `index.md` and must live inside the post directory.

## Supported Features
Multiple [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype) plugins to extend the basic functionality.

*Remark plugins*:
- [remark-sectionize](https://github.com/jake-low/remark-sectionize)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [remark-emoji](https://github.com/rhysd/remark-emoji)

*Rehype plugins*
- [rehype-external-links](https://github.com/rehypejs/rehype-external-links)
- [rehype-slug](https://github.com/rehypejs/rehype-slug)
- [rehype-toc](https://github.com/JS-DevTools/rehype-toc)

## How To Install
Simply run
```
pnpm install
```
to install all necessary dependencies.
You may also use `npm` or `yarn`.

## Commands

### Dev Server
Use `pnpm dev` to startup a dev server.
The website will be available at `http://localhost:5173`


### Build
Build the static website with `pnpm build`.
This will generate all static html files and bundle up javascript files.
After the command is done, the generated static website can be found in the directory `build`.

### Code Format
This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to ensure consistent code format.
