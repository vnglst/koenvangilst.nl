---
title: Forgit me nots
publishedAt: '2019-08-11'
summary: Git commands I keep forgetting
tags:
  - article
  - git
date: '2019-08-11'
layout: layouts/post.njk
permalink: /lab/for-git-me-nots/
---

## Squashing commits on Windows

I know there's a better way to do this (using rebase) but I like this way since it gives me more control.

```bash
git merge-base main yourBranch

# note commit hash

git reset --soft # enter commit hash

# all changes can now be committed again
```

It's easier on \*nix using the following oneliner:

```bash
git reset $(git merge-base main $(git rev-parse --abbrev-ref HEAD))
```

## Rebasing without pulling main

Rebase using the remote main to make sure you're really up to date. Useful when updating merge requests (on GitLab).

```bash
git pull --rebase origin main
```

## Copy file from main to current branch

```bash
git checkout main -- yarn.lock
```

## Useful aliases

### Add all and commit

```bash
ac=!git add . && git commit
```

### Pretty log

```bash
ls = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### Update last commit with current changes

```bash
amen = !git add --all && git commit --amend
```

### Undo last commit

```bash
git reset --soft HEAD^
```

Or add as an alias:

```bash
git config --global alias.undo 'reset --soft HEAD^'
```

## Oh no, I deleted all my work!?

Use the following command:

```bash
git reflog
```

and `cherry-pick` any commits you think could still have all your work.

## If .gitignore is not working

Do:

```bash
git rm -r --cached .
```

And after that:

```bash
git add --all
```

## Case insensitivity MacOS

MacOS by default ignores case in filenames and directories. Those differences go unnoticed until you push your working code to CI, where the build fails. To fix this once and for all use:

```bash
git config --global core.ignorecase false
```

## After Rebasing

Instead of using -f or --force developers should use

```bash
git push --force-with-lease
```

Why? Because it checks the remote branch for changes which is a good idea. Let's imagine that James and Lisa are working on the same feature branch and Lisa has pushed a commit. James now rebases his local branch and is rejected when trying to push. Of course James thinks this is due to rebase and uses --force and would rewrite all Lisa's changes. If James had used --force-with-lease he would have received a warning that there are commits done by someone else. I don't see why anyone would use --force instead of --force-with-lease when pushing after a rebase.

Source: https://stackoverflow.com/questions/8939977/git-push-rejected-after-feature-branch-rebase
