#!/bin/bash
set -e

echo "🧪 Running E2E tests before deployment..."

# Install Playwright browsers
echo "📦 Installing Playwright browsers..."
npx playwright install chromium --with-deps

# Run the tests (Playwright will start the dev server automatically)
echo "🎭 Running Playwright tests..."
npm run test:e2e -- --project=chromium

echo "✅ All tests passed! Proceeding with deployment..."
