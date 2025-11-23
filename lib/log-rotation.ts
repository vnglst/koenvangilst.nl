import { writeFile, readFile, rename } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MAX_LOG_ENTRIES = 1000;
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'llm-reports.jsonl');

export interface LLMReport {
  timestamp: string;
  ip: string;
  topic?: string;
  llmName?: string;
  findings?: string;
  userAgent?: string;
}

/**
 * Sanitize input to prevent injection attacks
 */
function sanitize(input: string | undefined, maxLength: number = 500): string {
  if (!input) return '';
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
}

/**
 * Count lines in log file
 */
async function countLogLines(): Promise<number> {
  if (!existsSync(LOG_FILE)) return 0;

  try {
    const content = await readFile(LOG_FILE, 'utf-8');
    return content.split('\n').filter(line => line.trim()).length;
  } catch {
    return 0;
  }
}

/**
 * Rotate log file if it exceeds max entries
 */
async function rotateIfNeeded(): Promise<void> {
  const count = await countLogLines();

  if (count >= MAX_LOG_ENTRIES) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archivePath = path.join(LOG_DIR, `llm-reports-${timestamp}.jsonl`);

    try {
      await rename(LOG_FILE, archivePath);
      console.log(`Rotated log file to ${archivePath}`);
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }
}

/**
 * Append a log entry with automatic rotation
 */
export async function appendLog(report: Partial<LLMReport>): Promise<void> {
  // Ensure logs directory exists
  if (!existsSync(LOG_DIR)) {
    const { mkdir } = await import('fs/promises');
    await mkdir(LOG_DIR, { recursive: true });
  }

  // Sanitize all inputs
  const sanitizedReport: LLMReport = {
    timestamp: new Date().toISOString(),
    ip: sanitize(report.ip || 'unknown', 50),
    topic: sanitize(report.topic, 200),
    llmName: sanitize(report.llmName, 100),
    findings: sanitize(report.findings, 1000),
    userAgent: sanitize(report.userAgent, 200)
  };

  // Rotate if needed before writing
  await rotateIfNeeded();

  // Append to log file
  const logLine = JSON.stringify(sanitizedReport) + '\n';

  try {
    await writeFile(LOG_FILE, logLine, { flag: 'a' });
  } catch (error) {
    console.error('Failed to write log:', error);
    throw error;
  }
}

/**
 * Get recent log entries
 */
export async function getRecentLogs(limit: number = 100): Promise<LLMReport[]> {
  if (!existsSync(LOG_FILE)) return [];

  try {
    const content = await readFile(LOG_FILE, 'utf-8');
    const lines = content
      .split('\n')
      .filter(line => line.trim())
      .slice(-limit);

    return lines.map(line => JSON.parse(line));
  } catch {
    return [];
  }
}
