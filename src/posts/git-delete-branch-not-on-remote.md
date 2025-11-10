---
title: Cleaning up local branches
summary: A bash script that deletes all local branches not found on the remote.
publishedAt: '2022-02-10'
tags:
  - snippet
  - git
  - bash
date: '2022-02-10'
layout: layouts/post.njk
permalink: /lab/git-delete-branch-not-on-remote/
---

```bash
git branch -vv | grep ': gone]'|  grep -v "\*" | awk '{ print $1; }' | xargs -r git branch -d
```

Useful for cleaning up a local repository with lots of stale branches.
The script can also be used with the -D flag (instead of -d).
This will delete all local branches, even if they have any unmerged changes.
