#!/usr/bin/env node
// Simple ESM wrapper for Nuxt 3 / Nitro server start
// cPanel may require a .js startup file; this imports the Nitro server entrypoint
import('./.output/server/index.mjs')
  .then(() => {
    // started
  })
  .catch((err) => {
    // Log and exit with non-zero status so process manager shows failure
    console.error('Failed to start Nuxt server:', err);
    process.exit(1);
  });
