# Production Deployment

## Target
Cloudflare Workers Static Assets using Wrangler.

## Required GitHub Environment
Create a GitHub Environment named `production` and add:
- `CLOUDFLARE_API_TOKEN` (secret)
- `CLOUDFLARE_ACCOUNT_ID` (secret)

The workflow validates the game runtime and canonical data before deployment.

## Release flow
`qa-hardening` → QA → `main` → version tag → production workflow → Cloudflare.

Never commit Cloudflare tokens to the repository.
