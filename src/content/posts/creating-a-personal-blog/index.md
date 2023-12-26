---
title: 'Creating a personal blog'
publishedAt: '2023-12-16'
description: 'In my first post I will take you through the journey of how I finally made this blog. I will discuss my requirements, the challenges I encountered, and about the solutions I implemented.'
tags:
  - development
---

In my first post I will take you through the journey of how I finally made this blog. I will discuss my requirements, the challenges I encountered, and about the solutions I implemented.

# Why
A personal blog is something I wanted to build for a long time but never came around doing.
Alongside my studies I have always been actively learning and exploring topics in the fields of development and security.
By undertaking smaller and larger project, and by solving security challenges I slowly built up a portfolio of achievements.

While showcasing development projects is relatively easy, since you have something visually to show or can simply link the project repository, showcasing knowledge and achievements in security-related topics is more difficult.
Thus, I wanted to build a personal blog to do just that.

# Requirements
My main requirement for this project was that I want to write posts in markdown and serve them as statically generated html files.
This makes writing posts easy and doesn't require a complex and resource-heavy server.

I also wanted to use [Svelte](https://svelte.dev/) to build the website.
In the past, I usually used [React](https://react.dev/) to build websites and was happy with it.
However, since discovering Svelte I always wanted to try it and thought that this would be the perfect opportunity.

For the posts themselves I decided on some must-have features that I think are essential for this kind of blog.

Code snippets are really helpful when showing commands or relevant sections of code.
However, it can become difficult to read without syntax highlighting.
So a must-have are code blocks with syntax highlighting.
A copy button and a small banner that shows the programming languages are also important.
However, I don't think of them as a must have.
Especially as I don't intent to write guides where this features becomes really useful.

A table of contents provide a good outline of the current post and an easy way to skip to interesting sections.
While they are helpful without any extras, I personally prefer table of contents that additionally indicate what sections you are currently reading or are visible.
A nice implementation of this type of table of contents is used by the *MDN Web Docs*, as can be seen in their [Svelte guide](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_getting_started).
I wanted to integrated a similar table of contents.
However, instead of highlighting only one sections, which can become a little bit confusing and tends to skip small sections, my implementation should highlight every visible section.

Tags helps organizing and categorizing posts.
By looking at the post's tags, a user can easily decide I it interests them or not.
Thus, integrating tags into posts was a must for me.

Lastly, with a growing number of posts it can become quite difficult to discover interesting posts or find a specific post.
In such a case, a search bar is essential to avoid user frustration and to make your posts more easily accessible.
A search feature is also the perfect place to integrate the previously mentioned tags.
Someone interested in cybersecurity might not care about software development posts and can simply limit the search to posts with the tag *security*.
My intention was to implement a search bar that lets the user search for tags and text simultaneously.


To summarize, I had the following requirements for this projects.
- Write posts in markdown
- Create static html files
- Use svelte/sveltekit
- Code highlighting in code blocks
- Table of contents that highlights the currently visible sections
- Tags for post
- Search bar to search for posts and tags


# Development


# Challenges

# Further Tasks

## What is still missing?

## What can you expect from this blog

## Next Steps