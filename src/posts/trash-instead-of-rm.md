---
title: Use trash instead of rm
summary: 'Stop using rm -rf node_modules, use Trash instead.'
publishedAt: '2022-11-04'
tags:
  - snippet
  - bash
  - terminal
date: '2022-11-04'
layout: layouts/post.njk
permalink: /lab/trash-instead-of-rm/
---

Based on [this excellent 🔥 tip](https://mobile.twitter.com/wesbos/status/1588520765380612098) by Wes Bos
and the ensuing Twitter thread I've added the following to my `.zshrc`:

```bash
trash() {
  echo "🗑️ Moving files to Trash can..."
  mv "$@" "$HOME/.trash"
}
```

Now instead of using the destructive `rm -rf node_modules` I use
`trash node_modules` to delete files. This is:

- faster - milliseconds instead of minutes
- safer - you can always restore files if you make a mistake

Another option would be to install the [Node.js based cli](https://github.com/sindresorhus/trash-cli) by @sindresorhus.
