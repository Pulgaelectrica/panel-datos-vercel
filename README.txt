INSTRUCTIONS
1) Before deploying, edit 'api/finnhub-proxy.js' and replace 'REPLACE_WITH_YOUR_FINNHUB_API_KEY' with your Finnhub API key,
   OR set the environment variable FINNHUB_API_KEY in Vercel dashboard (recommended).

2) Deploy to Vercel:
   - Option A (recommended): Push this folder to GitHub and import repository in Vercel.
   - Option B: Use 'vercel' CLI with 'vercel deploy' in this folder.

3) After deploy, open: https://<your-vercel-domain>/ and your panel should show live prices.

NOTE: This package intentionally does NOT include the API key for safety. Paste it in 'api/finnhub-proxy.js' if you want it embedded.
