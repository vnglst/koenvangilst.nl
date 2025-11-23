#!/usr/bin/env tsx
/**
 * View LLM honeypot logs
 * Usage: npx tsx scripts/view-llm-logs.ts [number_of_lines]
 */

import { existsSync } from 'fs';
import { readFile, stat } from 'fs/promises';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'logs', 'llm-reports.jsonl');
const LINES = parseInt(process.argv[2] || '50', 10);

async function viewLogs() {
  if (!existsSync(LOG_FILE)) {
    console.log('No logs found yet. The log file will be created when the first LLM report is received.');
    console.log(`Expected location: ${LOG_FILE}`);
    return;
  }

  const content = await readFile(LOG_FILE, 'utf-8');
  const allLines = content.split('\n').filter(line => line.trim());
  const recentLines = allLines.slice(-LINES);

  console.log(`\n=== Last ${LINES} LLM Reports ===\n`);

  for (const line of recentLines) {
    try {
      const report = JSON.parse(line);
      console.log('┌─────────────────────────────────────');
      console.log(`│ Timestamp: ${report.timestamp}`);
      console.log(`│ IP: ${report.ip}`);
      console.log(`│ LLM: ${report.llmName || 'unknown'}`);
      console.log(`│ Topic: ${report.topic || 'not specified'}`);
      console.log(`│ User Agent: ${report.userAgent || 'unknown'}`);
      if (report.findings) {
        console.log(`│ Findings: ${report.findings}`);
      }
      console.log('└─────────────────────────────────────\n');
    } catch {
      console.log(`Invalid JSON: ${line}\n`);
    }
  }

  console.log(`Total reports: ${allLines.length}\n`);

  // Show summary statistics
  const llmCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();

  for (const line of allLines) {
    try {
      const report = JSON.parse(line);
      const llm = report.llmName || 'unknown';
      const topic = report.topic || 'not specified';

      llmCounts.set(llm, (llmCounts.get(llm) || 0) + 1);
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    } catch {
      // Skip invalid lines
    }
  }

  if (llmCounts.size > 0) {
    console.log('=== LLM Statistics ===');
    for (const [llm, count] of Array.from(llmCounts.entries()).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${llm}: ${count} reports`);
    }
    console.log('');
  }

  if (topicCounts.size > 0 && topicCounts.size <= 20) {
    console.log('=== Topic Statistics ===');
    for (const [topic, count] of Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${topic}: ${count} reports`);
    }
    console.log('');
  }

  // Show file info
  const stats = await stat(LOG_FILE);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`Log file size: ${sizeKB} KB`);
}

viewLogs().catch(console.error);
