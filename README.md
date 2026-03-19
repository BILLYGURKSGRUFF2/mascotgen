# Mascot Studio

Generate illustrated mascots with AI, then remove the background — entirely in your browser.

Built with [Google Gemini](https://aistudio.google.com) for image generation and [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) (via Transformers.js) for background removal. No backend required for BG removal — it runs fully client-side on WebGPU or WASM.

## Features

- **AI mascot generation** — prompt Gemini to create illustrated mascot images
- **One-click background removal** — RMBG-1.4 runs in the browser, no server, no API key
- **Batch BG removal** — queue multiple images and process them all at once
- **Bring your own API key** — your Gemini key is sent directly from your browser to Google's API via a lightweight proxy; it is never stored on any server

## How it works

```
Browser → POST /api/generate (apiKey + prompt) → Vercel function → Google Gemini API
                                                                           ↓
                                                                    image returned

Background removal: 100% in-browser (WebGPU → WASM fallback, ~90MB model cached after first use)
```

## Deploy your own (Vercel)

### 1. Clone and deploy

```bash
git clone https://github.com/your-username/mascot-studio
cd mascot-studio
vercel deploy
```

Or click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mascot-studio)

### 2. Get a free Gemini API key

Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — it's free.

### 3. Use the app

Paste your API key into the key field in the top bar. It's saved in your browser's `localStorage` and sent directly to Google on each request.

## Run locally

No build step required — it's a static site with a single serverless function.

```bash
npm i -g vercel
vercel dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
mascot-studio/
├── public/
│   └── index.html      ← entire frontend (vanilla JS, no framework)
├── api/
│   └── generate.js     ← Vercel serverless function (proxies Gemini API)
└── vercel.json         ← sets 60s max duration for the function
```

## Tech stack

| Concern | Solution |
|---|---|
| Image generation | Google Gemini (`gemini-2.5-flash-image` / `gemini-3.1-flash-image-preview`) |
| Background removal | [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) via `@huggingface/transformers` v3 |
| BG removal runtime | WebGPU (GPU-accelerated) with automatic WASM fallback |
| Post-processing | BFS flood-fill + morphological dilation (vanilla JS) |
| Frontend | Single HTML file, no framework, no build step |
| Backend | Vercel serverless function |

## License

MIT
