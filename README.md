# Mascot Studio — Setup

## Netlify Environment Variables (Site Settings → Environment Variables)

Add these two:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Google AI Studio API key |
| `APP_SECRET` | Any random string you make up (e.g. `mj3k9xQp2wL8`) |

## Frontend

Open `public/index.html` and find this line:

```
"x-app-secret": "REPLACE_WITH_YOUR_APP_SECRET",
```

Replace it with whatever you set APP_SECRET to. Example:

```
"x-app-secret": "mj3k9xQp2wL8",
```

## Deploy

1. Drag the `mascot-studio` folder into Netlify
2. Set the two env vars above
3. Update the secret in index.html
4. Redeploy

Done. Only requests with the correct secret header will be accepted.
