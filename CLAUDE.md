# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is the **GitHub profile README** repository (`steve-gerald/steve-gerald`). GitHub automatically renders `README.md` as the public profile page at github.com/steve-gerald. There is no build system, no test suite, and no dependencies — the entire repository is a single Markdown file.

## Repository Structure

- `README.md` — the sole file; rendered directly as the GitHub profile page.

## Key Conventions in README.md

**Animated header**: Uses the [readme-typing-svg](https://readme-typing-svg.herokuapp.com) service. Each line in the `lines=` query parameter is URL-encoded (`+` for spaces, `%26` for `&`, `%2C` for commas).

**Skill badges**: All badges are [Shields.io](https://shields.io) static badges in the format:
```
https://img.shields.io/badge/<Label>-<Level>-<HexColor>?style=flat&logo=<logo-slug>&logoColor=<color>
```

**Social links**: LinkedIn and email badges are in a centered `<p align="center">` block using `style=for-the-badge`.

**Portfolio link**: Points to `https://steve-gerald.github.io/mon_portfolio/`.

## Making Changes

Since there is no CI or tooling, changes are made by editing `README.md` directly, then committing and pushing to `main`. There is nothing to build or test locally — the rendered result is only visible on the live GitHub profile page after pushing.
