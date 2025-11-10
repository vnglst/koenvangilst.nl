---
title: United Nations Speeches
publishedAt: '2025-01-01'
summary: >-
  A side-project that analyzes diplomatic relationships through speeches during
  the 2024 UN General Assembly.
tags:
  - genai
  - side-project
date: '2025-01-01'
layout: layouts/post.njk
permalink: /lab/united-nations/
---

See [how world leaders talk about each other](https://un-speeches.koenvangilst.nl) during the 2024 UN General Assembly speeches. Select a country on the globe to explore diplomatic relationships and find out who's saying what about whom.

The visualization simplifies each speech into country mentions, categorizing them as either optimistic or pessimistic. The color of a country indicates how often it is mentioned by others.

The project relies heavily on GenAI for several tasks:

- Reading speech documents in multiple languages
- Identifying both direct and indirect mentions of other countries
- Extracting and translating relevant quotations that demonstrate positive or negative sentiment
- Mapping mentions to correct ISO country codes

This project was created by Koen van Gilst and is open-source on GitHub. You can find it on GitHub at [GitHub Repository Link](https://github.com/vnglst/un-speeches). A demo of the project is available at [Demo Link](https://un-speeches.koenvangilst.nl/).
