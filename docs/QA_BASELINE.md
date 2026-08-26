# QA Baseline & Release Gates

## Baseline

`v1.0.0-qa-baseline` is the protected reference point for the current prototype. New hardening work is developed from this baseline and must not rewrite the tag.

## Current automated gates

The `QA` GitHub Actions workflow checks:

1. JavaScript syntax for repository `.js` files.
2. Required runtime files: `index.html`, `app.js`, `game.js`, `animation.js`, `boot.js`.
3. Required `assets/` and `data/` directories.
4. Basic accidental-secret patterns.

## Phase 8 gate

Before production deployment, require all of the following:

- QA workflow passes.
- No critical console/runtime errors.
- Mobile touch flow is smoke-tested.
- Character → Inventory → Equipment → Stats → Damage → Monster → Loot flow is functional.
- Save/load behavior is verified.
- Production deployment is performed only from an approved commit.

## Rollback

If a release fails, return to the last known-good release/tag rather than rewriting history.
