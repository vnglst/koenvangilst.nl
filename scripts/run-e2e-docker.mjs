/**
 * Build and run a production-like Docker container, then execute the Playwright
 * e2e suite against it.
 *
 * Mirrors the production deployment (Nginx reverse proxy + Node SSR).
 *
 * Tests run serially (workers=1) because the emulated/limited container can be
 * overwhelmed by Playwright's default parallel workers.
 */
import { execSync, spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const COMPOSE_PROJECT = 'koenvangilst-e2e';
const COMPOSE_FILES = '-f docker-compose.yml -f docker-compose.local.yml';
const PORT = '3210';
const BASE_URL = `http://127.0.0.1:${PORT}`;

function run(command, options = {}) {
  console.log(`> ${command}`);
  return execSync(command, { stdio: 'inherit', ...options });
}

async function waitForHealth() {
  const maxAttempts = 90;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      execSync(`curl -sf ${BASE_URL}/health > /dev/null`, { stdio: 'ignore' });
      console.log(`Container healthy after ${attempt} second(s)`);
      return;
    } catch {
      await setTimeout(1000);
    }
  }
  throw new Error('Container did not become healthy in time');
}

async function runTests() {
  return new Promise((resolve) => {
    const proc = spawn('npm', ['run', 'test:e2e', '--', '--workers=1'], {
      stdio: 'inherit',
      env: { ...process.env, BASE_URL }
    });
    proc.on('close', (code) => resolve(code ?? 1));
  });
}

async function cleanup() {
  console.log('> Cleaning up Compose stack...');
  try {
    execSync(`docker compose -p ${COMPOSE_PROJECT} ${COMPOSE_FILES} down --volumes --rmi local`, {
      stdio: 'ignore'
    });
  } catch {
    // ignore
  }
}

function verifyProductionEndpoints() {
  run(`curl -sf ${BASE_URL}/og/fallback.png -o /dev/null`);
  run(`curl -sfI ${BASE_URL}/ | grep -i 'content-security-policy:'`);
  run(`curl -sfI ${BASE_URL}/fonts/ibm-plex-sans-400.woff2 | grep -i 'cache-control:.*immutable'`);
}

async function main() {
  const sourceCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const platform = process.env.E2E_DOCKER_PLATFORM ?? '';

  try {
    const environment = {
      ...process.env,
      SOURCE_COMMIT: sourceCommit,
      WEBSITE_PORT: PORT,
      PHOTOGRAPHY_DATA_SOURCE: './e2e/fixtures/photography',
      ...(platform ? { DOCKER_DEFAULT_PLATFORM: platform } : {})
    };
    const composeOptions = { env: environment };

    run(`docker compose -p ${COMPOSE_PROJECT} ${COMPOSE_FILES} build website og-generator`, composeOptions);
    run(`docker compose -p ${COMPOSE_PROJECT} ${COMPOSE_FILES} up -d website`, composeOptions);

    await waitForHealth();
    run(`docker compose -p ${COMPOSE_PROJECT} ${COMPOSE_FILES} up --no-deps og-generator`, composeOptions);
    verifyProductionEndpoints();

    const exitCode = await runTests();
    await cleanup();
    process.exit(exitCode);
  } catch (error) {
    console.error(error);
    await cleanup();
    process.exit(1);
  }
}

main();
