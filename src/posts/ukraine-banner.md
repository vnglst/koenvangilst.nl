---
title: Support Ukraine banner
summary: Add a stand with Ukraine banner using this TailwindCSS snippet
publishedAt: '2022-03-05'
tags:
  - snippet
  - css
  - tailwind
date: '2022-03-05'
layout: layouts/post.njk
permalink: /lab/ukraine-banner/
---

Show your support for Ukraine by adding this banner to your site.
If you're using Tailwind on your site you can copy paste this html snippet.
An example implementation for a React site can found
in [this pull request](https://github.com/vnglst/koenvangilst.nl/pull/96/files).

```html
<a target="_blank" rel="noopener noreferrer" href="https://www.stopputin.net/">
  <div
    className="bg-[#0066cc] text-white fixed flex items-center justify-center bottom-0 w-screen h-12 z-50"
  >
    <span className="block md:hidden">
      <strong className="text-[#ffcc00]">Stand with Ukraine.</strong> Donate →
    </span>
    <span className="hidden md:block">
      <strong className="text-[#ffcc00]">Stand with Ukraine.</strong>{' '}
      Petition your leaders. Show your support.
    </span>
  </div>
</a>
```
