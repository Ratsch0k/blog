---
title: 'Modding Future Cop: L.A.P.D - Introduction'
publishedAt: '2024-06-05'
description: "Giant futuristic robots? Ridiculous weapons? Huge explosions? Count me in! Future Cop: L.A.P.D., a game published by EA Redwood Shores back in 1998, promises everything and more. As one of my childhood's favorite games, I've always wanted to revisit this old gem. I have now found an excuse for exactly this. I'm reverse engineering and modding the game. In this post, I introduce, motivate, and set goals for why and how I want to do that."
tags:
  - reverse-engineering
  - series
  - development
---

# Modding Future Cop: L.A.P.D

In the mid-2000s, I had a computer with the demo of a game called **Future Cop: L.A.P.D**. Even though it was only a demo and I never got the chance to play the full game up until a few years ago, it was my favorite game from that time.

[Future Cop: L.A.P.D.](https://en.wikipedia.org/wiki/Future_Cop%3A_LAPD) is an old game released way back in 1998 that lets you fight against crime in a giant futuristic robot equipped with ridiculous weapons and is set in a dystopian future. Even better, the robot can transform into a hovering vehicle of destruction. The game has two modes, which can both be played single-player or in co-op. One mode is a story mode called _Crime Wars_, in which you fight on unique maps against evil villains and their minions. However, my fascination with the game lied in its _Precinct Assault_ mode, a type of _MOBA_. Your main goal was to defeat your opponent by deploying hover tanks and helicopters to fight and defend. What made this game really fun was your ability to actively participate in the fighting. With your futuristic robot, you traverse the map, fight the enemy's vehicles and turrets, and even capture neutral turrets to fight on your side. The game ends when a tank from either side invades the core of the enemy's base. With its fun game play, up-beat combat music, witty dialog, and fitting visual design, it became a very memorable game for me. However, over time the game slowly faded from my memory.

Over my years of gaming, I've always been fascinated by modding. I admired the dedication of people who reverse engineer a game and modify it to extend and improve it beyond what the game originally offered. The thought of modding a game often crossed my mind, and many years ago, I wrote some small Minecraft mods. However, besides that, I never really started a modding project of my own. Moreover, I wasn't much interested in modding modern games or using an already-developed modding framework. I was much more interested in getting my hands dirty with reverse engineering and discovering the ins-and-outs of an unexplored game.

Almost a year ago, I stumbled upon the YouTuber [_Nathan Baggs_](https://www.youtube.com/@nathanbaggs), who uploads entertaining and educational videos in which he reverse engineers and hacks mostly older games. For example, he hacked and patched _Worms 2_ to make it run on modern hardware in this [video](https://www.youtube.com/watch?v=eQOOx4mmY6I). While watching his videos, I remembered my childhood favorite _Future Cop: L.A.P.D._ and my desire to mod a game of my own. I thought that modding Future Cop would be an exciting project to achieve a long-desired goal.

In this post and a series of following posts, I want to document my findings, obstacles, and achievements. This initial post serves as an introduction to this project and explains what my goals are and how I intend to achieve them.

# My Goals for this Project

Obviously, the main goal of this project is to reverse engineer and mod the game, but those goals are rather large and open-ended. It is always difficult to define an exact scope at the start of a new project, but I still want to give a rough outline of what I want to achieve.

Generally, I don't intend to completely reverse engineer the entire game and all its logic. Instead, by reverse engineering parts of the game, I intend to enable more sophisticated and cool mods.

Regarding modding, I want easy-to-write mods, support for community-written mods, and an easy way to manage your own mods. For those reasons, the primary goal is to develop a mod manager that allows users to install and manage mods written by other users. Mods should be written in a scripting language and should be able to interact with the game using an API provided by the mod manager. The scripting language should make it easy and fast to develop mods, in contrast to writing mods in a compiled language. I have no clear goal of what the mods should be able to do because I don't know how much of the game I will be able to reverse engineer. I hope that they will eventually be able to:

- Render custom UI
- IO stuff
- Mod settings
- Spawn/Destroy entities
- React to game events
- Modify existing AI
- Custom weapons
- Custom vehicles
- Custom maps
- Networking

Overall, to achieve these goals, I have to dedicate a lot of time to reverse engineering the game. To my knowledge, there are two projects related to Future Cop. One is a map editor called [FC3DEditor](https://github.com/BahKooJ/FC3DEditor), developed by [BahKooJ](https://github.com/BahKooJ). The other one is a very much in-progress re-implementation of the game engine called [Future-Cop-MIT](https://github.com/Ghoster738/Future-Cop-MIT), developed by [Ghoster738](https://github.com/Ghoster738). However, no one has undergone the challenge of reverse engineering and modding the game.

# What am I using?

The work to achieve my goals mostly conists of reverse engineering the game's binary and developing the mod manager.

For static code analysis, I'm using [_Ghidra_](https://ghidra-sre.org/). Although Ghidra also has a debugger I could use, for some reason I couldn't really get it to properly work with the game. Therefore, I'm using another tool to dynamically analyze the game while it's running. Here, I'm using the 32-bit version of [x64dbg](https://x64dbg.com/), also called _x32dbg_. Unfortunately, I don't think I can upload my Ghidra project files, as they contain the game's entire binary, which I don't own.

On the development side, I'm using [_rust_](https://www.rust-lang.org/), as I'm a big fan. The mod manager should also get a GUI, for which I'm using the library [_iced_](https://iced.rs/). I'll get more into detail about how I'm building the mod manager and what libraries I'm using in an upcoming post. To manage my code, I'm using GitHub. I haven't yet made the repositories public, but I'll try to do that in the upcoming weeks.

# Documenting with Blog Posts

To document my progress and write down my findings, I want to publish blog posts just like this one. Currently, I'm far from being finished, but I already achieved some of my goals that I want to present in some upcoming posts.

For now, I plan to publish the following posts:

- Setup and initial improvements
- Injecting a mod manager
- Plugin system and mods
- The game's basics
- Rendering text
- Mods hooking the game

I'll also publish a post that provides an overview of all posts and the current progress, which I'll keep updating.
