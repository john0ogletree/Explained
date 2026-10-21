# Git: Version Control for Everyone

Git is a distributed version control system created by Linus Torvalds in 2005 to manage the Linux kernel's source code. It tracks changes to files over time, allowing multiple people to collaborate on the same codebase without overwriting each other's work. Today, Git is the de facto standard for version control, used by virtually every software project and hosted by platforms like GitHub, GitLab, and Bitbucket.

## Why Git Exists

Before Git, most teams used centralized version control systems like SVN or CVS. These had serious limitations:

- **Single point of failure** — if the central server went down, no one could commit.
- **Slow operations** — every action required a network round trip.
- **Branching was expensive** — creating a branch was a heavyweight operation, so teams avoided it.
- **Offline work was impossible** — you couldn't commit without a connection.

Torvalds designed Git to fix all of these. The Linux kernel project needed something that could:

- Handle thousands of contributors and millions of lines of code.
- Merge changes quickly and reliably.
- Work offline.
- Prevent corruption (every object is checksummed).
- Branch and merge cheaply.

The result is a **distributed** system: every clone is a full copy of the repository, with the complete history. Any clone can act as a server.

## How Git Thinks

Git models the repository as four areas:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Working Dir  │→ │    Index     │→ │    Local     │→ │    Remote    │
│ (files you   │  │  (staging    │  │  Repository  │  │  (GitHub,    │
│  edit)       │  │   area)      │  │  (.git)      │  │   origin)    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
        add ──────────── commit ────────── push ──────────→
        ←──────────── checkout ───────── pull ─────────────
```

- **Working directory** — the files you see and edit.
- **Index (staging area)** — changes you've marked to include in the next commit.
- **Local repository** — the complete history in `.git/`.
- **Remote** — a copy on another machine (usually GitHub).

Every commit is a **snapshot** of the entire tree, identified by a SHA-1 (soon SHA-256) hash. Git doesn't store diffs — it stores full snapshots and computes diffs on demand.

## Installation and Setup

```bash
git --version
```

Install via your package manager, or download from git-scm.com.

### First-time configuration

```bash
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"

# default branch name (Git 2.28+)
git config --global init.defaultBranch main

# editor for commit messages
git config --global core.editor "code --wait"

# line endings (important on Windows)
git config --global core.autocrlf input

# color output
git config --global color.ui auto

# aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --decorate"
```

View all config:

```bash
git config --list --show-origin
```

## Creating a Repository

```bash
# start from scratch
git init
git add .
git commit -m "Initial commit"

# or clone an existing repo
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git          # SSH
git clone https://github.com/user/repo.git mydir # custom directory
```

## The Core Workflow

The daily loop is always the same four steps:

```bash
git status                # what's changed?
git add file.js           # stage changes
git commit -m "message"   # record them
git push                  # send to remote
```

### `git status`

The most-used command. Shows what's changed, staged, and untracked.

```bash
git status
git status --short        # compact
git status -sb            # short + branch
```

### `git add`

Stages changes for the next commit.

```bash
git add file.js           # single file
git add src/              # directory
git add .                 # everything in current dir
git add -A                # all changes, including deletions
git add -p                # interactively stage hunks
```

`git add -p` (patch mode) is the most powerful — it lets you stage part of a file, so you can split unrelated changes into separate commits.

### `git commit`

Records staged changes as a snapshot.

```bash
git commit -m "Add login form"
git commit                # opens editor for longer message
git commit -am "msg"      # stage tracked files and commit (not new files)
git commit --amend        # rewrite the last commit
git commit --amend --no-edit  # amend without changing the message
```

**Commit message conventions:**

```
Short summary (50 chars or less)

Longer explanation if needed. Wrap at 72 characters. Explain what
changed and why, not how — the diff shows how.

Closes #42
```

### `git log`

View history.

```bash
git log
git log --oneline
git log --oneline --graph --all --decorate
git log -n 5                    # last 5 commits
git log --author="Ada"
git log --since="2 weeks ago"
git log -p file.js              # with diffs
git log --stat                  # with file stats
git log --all --grep="login"    # search commit messages
```

### `git diff`

Compare changes.

```bash
git diff                  # working dir vs index
git diff --staged         # index vs last commit
git diff HEAD             # working dir vs last commit
git diff branch1..branch2 # between branches
git diff --stat           # summary only
```

## Branching

Branches in Git are cheap pointers to commits. Creating one is instant.

```bash
git branch                    # list local branches
git branch -a                 # include remote
git branch feature            # create
git checkout feature          # switch
git switch feature            # modern alternative
git switch -c feature         # create and switch
git branch -d feature         # delete (safe)
git branch -D feature         # delete (force)
git branch -m new-name        # rename current
```

### Merging

```bash
git switch main
git merge feature
```

If the branches diverged, Git either:

- **Fast-forwards** — main simply advances to feature's tip.
- **Creates a merge commit** — combines both histories with two parents.
- **Conflicts** — you resolve them, then commit.

### Rebasing

Rebase replays your commits on top of another branch, producing a linear history.

```bash
git switch feature
git rebase main
```

Rebase is cleaner than merge but **rewrites history**. Never rebase commits that have been pushed to a shared branch.

### Interactive Rebase

Rewrite history — squash, reorder, edit, or drop commits.

```bash
git rebase -i HEAD~3
```

An editor opens with a list:

```
pick abc123 Add login form
pick def456 Fix typo
pick ghi789 Add tests

# Commands:
# p, pick   use commit
# r, reword use commit, but edit the message
# e, edit   use commit, but stop for amending
# s, squash use commit, but meld into previous commit
# f, fixup  like squash, but discard this commit's message
# d, drop   remove commit
```

Change `pick` to `squash` to combine commits, `drop` to delete, `reword` to fix a message. Then force-push.

```bash
git push --force-with-lease
```

`--force-with-lease` refuses to overwrite if someone else pushed in the meantime.

## Remotes

A remote is a named URL pointing to another copy of the repository.

```bash
git remote -v                              # list
git remote add origin git@github.com:user/repo.git
git remote set-url origin https://github.com/user/repo.git
git remote remove origin
```

### Push

```bash
git push                                   # current branch to its upstream
git push -u origin main                    # set upstream and push
git push origin feature                    # specific branch
git push --tags                            # push tags
git push --force-with-lease                # safer force-push
```

### Pull and Fetch

```bash
git pull                    # fetch + merge
git pull --rebase           # fetch + rebase (linear)
git fetch                   # download without merging
git fetch origin main       # specific branch
```

**Fetch first, then inspect.** `git pull` is convenient but hides what it's doing. `git fetch && git log HEAD..origin/main` shows what's incoming.

## Undoing Things

Git is famously hard to undo. Here's what to reach for.

### Unstage a File

```bash
git restore --staged file.js
# older syntax
git reset HEAD file.js
```

### Discard Working Directory Changes

```bash
git restore file.js
# older syntax
git checkout -- file.js
```

**Warning:** this destroys uncommitted work permanently.

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1     # keep changes staged
git reset --mixed HEAD~1    # keep changes unstaged (default)
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

**Warning:** this destroys uncommitted work.

### Undo a Pushed Commit Safely

```bash
git revert <commit-hash>
```

`revert` creates a new commit that undoes the changes, preserving history. This is the only safe way to undo a published commit.

### Find Lost Commits

```bash
git reflog
```

The reflog records every HEAD movement for 90 days. Almost any commit, reset, or rebase is recoverable from it.

```bash
git reset --hard <hash-from-reflog>
```

### Cherry-pick

Apply a single commit from another branch.

```bash
git cherry-pick <commit-hash>
git cherry-pick <hash1> <hash2>    # multiple
git cherry-pick <hash1>..<hash2>   # range
```

## Stashing

Temporarily shelve uncommitted changes without committing.

```bash
git stash                     # save current changes
git stash push -m "wip"       # with message
git stash -u                  # include untracked files
git stash list                # see all stashes
git stash show -p             # see contents
git stash pop                 # apply and remove
git stash apply               # apply and keep in stash
git stash drop                # remove
git stash clear               # remove all
```

## Tags

Tags mark specific commits — usually releases.

```bash
git tag v1.0.0                            # lightweight
git tag -a v1.0.0 -m "Release 1.0.0"     # annotated (recommended)
git tag                                   # list
git push origin v1.0.0                    # push single tag
git push --tags                           # push all
git tag -d v1.0.0                         # delete local
git push origin --delete v1.0.0           # delete remote
```

Semantic versioning (`v1.2.3`) is the standard for releases.

## Resolving Conflicts

Conflicts happen when two branches modify the same lines. Git marks the conflict in the file:

```
<<<<<<< HEAD
const color = "blue";
=======
const color = "red";
>>>>>>> feature
```

Edit the file to keep what you want, delete the markers, then:

```bash
git add file.js
git commit                # merge auto-creates the commit message
```

Or during a rebase:

```bash
git add file.js
git rebase --continue
```

Or abort entirely:

```bash
git merge --abort
git rebase --abort
```

Tools that help:

```bash
git mergetool             # opens configured merge tool
git diff --name-only --diff-filter=U   # list conflicted files
```

## `.gitignore`

Tells Git which files to ignore. Every repo should have one.

```gitignore
# dependencies
node_modules/
vendor/

# builds
dist/
build/
*.log

# environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# editors
.vscode/
.idea/
*.swp
```

Patterns:

| Pattern | Matches |
|---------|---------|
| `*.log` | Any `.log` file |
| `!important.log` | Exception to a previous rule |
| `/build` | Only at repo root |
| `build/` | Any `build` directory |
| `**/logs` | Any `logs` anywhere |

Check what's ignored:

```bash
git check-ignore -v file.log
git status --ignored
```

## Workflows

### Feature Branch Workflow

The most common pattern.

```bash
git switch main
git pull
git switch -c feature/login
# ...work...
git add .
git commit -m "Add login"
git push -u origin feature/login
# open a pull request
```

Every feature gets its own branch. `main` stays deployable.

### Trunk-Based Development

Everyone commits to `main` (or short-lived branches). Requires strong CI and feature flags.

### Git Flow

Long-lived `develop`, `release/`, `hotfix/` branches. Heavyweight but structured. Rarely used for web apps today.

### Forking Workflow

Used by open-source projects. Contributors fork the repo, push to their fork, and open pull requests.

## Pull Requests

A pull request (PR) is a proposal to merge a branch into another. It's the core collaboration mechanism on GitHub, GitLab, and Bitbucket.

Good PR practices:

- **Small PRs.** Under 400 lines changed. Smaller is easier to review.
- **Descriptive titles.** `Fix login redirect loop when session expires`, not `Fix bug`.
- **Context in the description.** What changed, why, and how to test.
- **One concern per PR.** Don't mix a refactor with a feature.
- **Link the issue.** `Closes #42`.
- **Self-review first.** Read your own diff before requesting review.
- **Screenshots for UI changes.**

## Merge Strategies

When merging a PR, you choose:

| Strategy | Result |
|----------|--------|
| **Merge commit** | Preserves all commits + a merge commit |
| **Squash and merge** | Combines all commits into one |
| **Rebase and merge** | Replays commits without a merge commit |

**Squash** is the most common default — it keeps history clean and lets PRs include messy WIP commits without polluting `main`.

## Useful Commands

```bash
git blame file.js                  # who changed each line
git show <hash>                    # details of a commit
git show <hash>:file.js            # file contents at commit
git grep "TODO"                    # search tracked files
git shortlog -sn                   # commit counts by author
git log --all --oneline | head    # recent commits across branches
git bisect start                   # binary search for a bug
git clean -fd                      # remove untracked files (careful!)
git worktree add ../other main    # checkout another branch in a second directory
git submodule update --init --recursive
git archive --format=zip HEAD > project.zip
git count-objects -vH              # repo size
```

### `git bisect`

Binary search through history to find the commit that introduced a bug.

```bash
git bisect start
git bisect bad                     # current commit is broken
git bisect good v1.0.0             # last known good
# Git checks out a middle commit; test it
git bisect good                    # or "bad"
# repeat until Git identifies the culprit
git bisect reset
```

Automate with `git bisect run ./test.sh`.

## Internals (Brief)

Understanding Git's internals helps when things go wrong.

- **Blobs** — file contents, hashed.
- **Trees** — directories (lists of blobs and trees).
- **Commits** — snapshots pointing to a tree, a parent commit, and metadata.
- **Refs** — pointers to commits (`main`, `HEAD`, `origin/main`, tags).
- **The reflog** — a log of every ref change.

```bash
git cat-file -p HEAD       # inspect a commit
git ls-tree HEAD           # tree at HEAD
git rev-parse HEAD         # hash of HEAD
```

Everything is content-addressed. A commit is identified by the hash of its contents, which is why history is tamper-evident.

## Common Pitfalls

- **Committing secrets.** API keys, passwords, `.env` files. Once pushed, assume compromised — rotate immediately and consider history rewriting (`git filter-repo`).
- **Force-pushing shared branches.** Rewrites history for everyone. Use `--force-with-lease` and never force-push `main`.
- **Merging instead of rebasing local branches.** Merge commits clutter history. Rebase local feature branches before opening a PR.
- **Not pulling before starting.** Diverging history causes avoidable conflicts.
- **Giant commits.** A 5,000-line commit is unreviewable and un-revertable. Commit early, commit often.
- **Vague commit messages.** `update`, `fix`, `wip` are useless six months later. Write messages for your future self.
- **Ignoring `.gitignore`.** Committing `node_modules` bloats the repo permanently.
- **Editing history that's been shared.** Rebase and amend are for local commits. Published commits should be reverted, not rewritten.
- **Losing work with `git reset --hard`.** Uncommitted changes are gone. Commit or stash first.
- **Using `git pull` blindly.** It merges silently and can create unwanted merge commits. `git fetch` then inspect.
- **Large files.** Git stores full snapshots. A 100 MB video in history is 100 MB forever. Use Git LFS or don't commit them.

## Git Hosting

| Platform | Notes |
|----------|-------|
| GitHub | Largest, most integrations |
| GitLab | Integrated CI/CD, self-hostable |
| Bitbucket | Atlassian ecosystem |
| Gitea | Lightweight self-hosted |
| Codeberg | Non-profit, EU-hosted |
| Sourcehut | Minimalist, email-based |

All of them speak the same Git protocol. The repository is portable.

## Git LFS

Git Large File Storage replaces large files with text pointers and stores the actual content on a separate server.

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

Good for design files, video, audio, binaries. Bad for anything Git can diff.

## Summary

Git's value comes down to five things:

1. **Distributed** — every clone is a full repository with complete history.
2. **Fast** — most operations are local, on the order of milliseconds.
3. **Safe** — content-addressed storage means history can't be silently corrupted.
4. **Cheap branching** — branches are pointers, so branching is free and encouraged.
5. **Universal** — every language, every platform, every team.

Git has a reputation for being hard, and its command surface is genuinely large. But the daily workflow is only a handful of commands, and everything else — rebasing, bisecting, reflogging — is a tool you reach for when you need it. Understanding the model (working directory → index → repository → remote) turns the commands from memorized incantations into obvious operations.

## Further Reading

- Official docs: git-scm.com/doc
- Pro Git (free book): git-scm.com/book
- *Learn Git Branching* (interactive): learngitbranching.js.org
- *Oh Shit, Git!?!*: ohshitgit.com
- GitHub Skills: skills.github.com
- Atlassian Git tutorials: atlassian.com/git/tutorials
- `git help <command>` for every command
