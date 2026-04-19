# Deploy Skill

Deploy the koenvangilst.nl website to production with full verification.

## Overview

This skill handles the complete deployment workflow:

1. Run all verification checks (tests, type-check, lint, knip)
2. Build for production
3. Commit any pending changes
4. Push to origin
5. Wait for deployment
6. Verify production endpoints

## Prerequisites

- All changes should be committed or staged
- Working directory should be clean (or have changes ready to commit)
- Git remote should be configured

## Steps

### 1. Run Verification Checks

Run all quality checks in parallel:

```bash
npm run test
npm run type-check
npm run lint
npm run knip
```

All checks must pass before proceeding.

### 2. Production Build

Build the site to verify it compiles successfully:

```bash
npm run build
```

Expected: Build completes with 92 static pages generated.

### 3. Commit Changes (if any)

If there are uncommitted changes, commit them using the commit skill.

### 4. Push to Origin

Push the current branch to origin:

```bash
git push origin $(git branch --show-current)
```

### 5. Wait for Deployment

Wait approximately 5 minutes for the CI/CD pipeline to build and deploy:

```bash
sleep 300
```

### 6. Verify Production

Check key endpoints to confirm successful deployment:

| Endpoint                                                     | Expected Result                       |
| ------------------------------------------------------------ | ------------------------------------- |
| https://koenvangilst.nl                                      | 200 OK, version footer matches commit |
| https://koenvangilst.nl/lab                                  | 200 OK, listing renders               |
| https://koenvangilst.nl/lab/ai-and-the-future-of-engineering | 200 OK, article renders               |
| https://koenvangilst.nl/feed.xml                             | 200 OK, valid RSS XML                 |
| https://koenvangilst.nl/health                               | 200 OK, health check passes           |

Verify the version footer on the homepage shows the correct commit hash.

## Success Criteria

- All verification checks pass
- Production build succeeds
- Changes pushed to origin
- All production endpoints return 200 OK
- Version footer matches deployed commit hash

## Rollback

If production verification fails:

1. Identify the issue from error logs
2. Fix locally
3. Re-run deploy skill
