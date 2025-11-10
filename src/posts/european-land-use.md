---
title: European Land Use Visualization
publishedAt: '2025-10-25'
summary: >-
  An expanded hexagonal map visualization comparing land use across multiple
  European countries, showing how water, nature, cities, and agriculture are
  distributed. See what makes Dutch land use special - or not.
tags:
  - data visualization
  - side-project
date: '2025-10-25'
layout: layouts/post.njk
permalink: /lab/european-land-use/
---

We have a Dutch election coming up this week and how we use our limited land is a hotly debated topic. From housing, farming and renewable energie: it's all about the land.

Last year I shared an animated hexagonal map of Dutch land use. I've now expanded this to include several more European countries, so you can see what makes Dutch land use so special - or not.

Live demo: https://onsland.koenvangilst.nl/

<video width="672" height="577" muted loop controls autoPlay playsInline>
  <source src="https://github.com/user-attachments/assets/2e425a3a-3fa4-439e-a37d-18a6d4a0877b" type="video/mp4" />
</video>

Each hex shows a certain land percentage. On the map you can see how this is split into Water, Nature, Cities, and Agriculture.

If you want to help add more countries, I'd appreciate PRs on GitHub. The map rendering is already there, it only requires land use data which can be found in the SQLite database (at least for EU countries).

Github: https://github.com/vnglst/onsland
