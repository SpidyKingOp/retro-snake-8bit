---
name: deploy-gh-pages
description: >-
  Deploy a static Vite/React web app to GitHub Pages using the gh-pages package.
  Use when the user requests publishing, deploying, or updating their web app on GitHub Pages.
---

# GitHub Pages Deployment Workflow

Deploy static web builds to GitHub Pages avoiding common OAuth token permission roadblocks.

## Workflow Steps

1. **Verify Base Path**:
   Ensure `vite.config.ts` has `base: './'` set for relative path resolution.

2. **Build and Deploy via gh-pages**:
   Run the production build and publish the output `dist` directory directly to the `gh-pages` branch.
   *(Note: This avoids GitHub CLI OAuth scope errors that occur when attempting to push `.github/workflows/` files).*

   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   npm run build
   npx --yes gh-pages -d dist
   ```

3. **Verify Deployment Status**:
   Check GitHub Pages API to confirm build status and retrieve the live URL:

   ```powershell
   gh api repos/:owner/:repo/pages
   ```
