---
title: Custom scrollbars
summary: 'It''s something you easily forget, but it''s easy and looks so much better.'
publishedAt: '2021-12-12'
tags:
  - snippet
  - css
date: '2021-12-12'
layout: layouts/post.njk
permalink: /lab/styling-scrollbars/
---

Here's an example of how to do it:

```css
::-webkit-scrollbar {
  width: 6px;
  height: 12px;
}

::-webkit-scrollbar-thumb {
  background-color: #d9dadb;
  border-radius: 12px;
}
```
