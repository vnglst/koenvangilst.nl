# Coolify Configuration

This directory contains configuration for deploying with Coolify.

## E2E Testing Integration

There are two ways to integrate E2E tests with your Coolify deployment:

### Option 1: Pre-Deployment Command (Recommended for Coolify)

In your Coolify dashboard, configure the **Pre Deployment Command**:

```bash
bash .coolify/pre-deploy.sh
```

This will:
- Install Playwright browsers
- Run all E2E tests before building
- Only proceed with deployment if tests pass

**Note:** This approach runs tests before the Docker build, so deployment will be blocked if tests fail.

### Option 2: Manual Testing

If you prefer to run tests separately (not blocking deployment), you can:

1. Run tests locally before pushing:
   ```bash
   npm run test:e2e
   ```

2. Set up GitHub Actions to run tests on PRs (optional)

## Coolify Dashboard Settings

Recommended settings for your Coolify application:

- **Build Pack**: Dockerfile
- **Dockerfile Location**: `./Dockerfile`
- **Pre Deployment Command**: `bash .coolify/pre-deploy.sh` (if using Option 1)
- **Health Check Path**: `/` (optional, for better monitoring)

## Notes

- The pre-deploy script uses Chromium only to speed up test execution
- Tests run with the dev server (as configured in `playwright.config.ts`)
- If tests fail, the deployment will be aborted
