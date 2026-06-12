# Typer

A typing practice game built with React and Vite.

![Screenshot](../images/img.png)

## Tabs

### Typer
Letter typing game with a QWERTY keyboard. Each key press triggers confetti, spaced
repetition for struggling letters, and a walking person animation.

### Animals
Animal name typing game. An image from Pics4Learning appears — type the animal's
name letter by letter. Correct answers trigger confetti and a miniature animal image
pops out and walks across the screen. Spaced repetition adapts difficulty, starting
with short names (cat, dog) and progressing to longer ones.

## Features

- **Two game modes**: Typer (letters) and Animals (animal names)
- **Hash-based tab switching** — bookmarkable URLs (`/#animals`)
- **Canvas walking animations** — people (Typer) and animal images (Animals)
- **Confetti bursts** on correct answers
- **Spaced repetition** (SM-2) — struggling items appear more often
- **96 verified animal images** from Pics4Learning with rolling image verification
- **Image pre-verification** — only animals with confirmed working images are prompted
- **localStorage persistence** — score and progress survive refreshes
- **Case-insensitive matching** in Animals mode
- **Purple accent theme** (`--accent: #aa3bff`)
- **Commit hash in footer** — click to open exact commit on GitHub

## Getting Started

```sh
cd typer
npm install
npm run dev
```

Or use the one-liner from the repo root:

```sh
./host.sh
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — build tool
- **canvas-confetti** — confetti effects
- **Pics4Learning** — animal image source
