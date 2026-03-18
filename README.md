# Mascot Studio — Netlify Deploy

## Setup (5 min)

### 1. Deploy to Netlify
Drag the entire `mascot-studio` folder into [app.netlify.com/drop](https://app.netlify.com/drop)

### 2. Set your API key
1. Go to your Netlify site → **Site configuration → Environment variables**
2. Add: `GEMINI_API_KEY` = your Google AI Studio key
3. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free)

### 3. Redeploy
After adding the env var, trigger a redeploy:
**Deploys → Trigger deploy → Deploy site**

That's it — open your Netlify URL on any device.

## Project structure
```
mascot-studio/
├── index.html                  ← The entire frontend
├── netlify.toml                ← Routing config
└── netlify/
    └── functions/
        └── generate.js         ← Proxy to Nano Banana 2
```

## How it works
- Frontend calls `/api/generate`
- `netlify.toml` rewrites that to `/.netlify/functions/generate`
- The function forwards the request to Google's Gemini API with your key
- Your API key never touches the browser
