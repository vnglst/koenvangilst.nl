/**
 * Build and run a production-like Docker container, then execute the Playwright
 * e2e suite against it.
 *
 * Mirrors the production deployment (Nginx reverse proxy + Node SSR). It mounts
 * public/static so filesystem-dependent photography tests can manipulate
 * photos-data.json on the host and have those changes reflected in the container.
 *
 * Tests run serially (workers=1) because the emulated/limited container can be
 * overwhelmed by Playwright's default parallel workers.
 */
import { execSync, spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const IMAGE_NAME = 'koenvangilst-e2e';
const CONTAINER_NAME = 'koenvangilst-e2e';
const PORT = '3000';
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
  console.log('> Cleaning up container and image...');
  try {
    execSync(`docker stop ${CONTAINER_NAME} > /dev/null 2>&1`);
    execSync(`docker rm ${CONTAINER_NAME} > /dev/null 2>&1`);
  } catch {
    // ignore
  }
  try {
    execSync(`docker rmi ${IMAGE_NAME} > /dev/null 2>&1`);
  } catch {
    // ignore
  }
}

async function main() {
  const sourceCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const platform = process.env.E2E_DOCKER_PLATFORM ?? '';
  const platformFlag = platform ? `--platform ${platform} ` : '';

  try {
    run(`docker build ${platformFlag}--build-arg SOURCE_COMMIT=${sourceCommit} -t ${IMAGE_NAME} .`);

    run(
      `docker run -d -p ${PORT}:${PORT} -v "${process.cwd()}/public/static:/app/public/static" --name ${CONTAINER_NAME} ${IMAGE_NAME}`
    );

    await waitForHealth();

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
