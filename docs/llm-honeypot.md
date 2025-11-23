# LLM Honeypot

This website includes a "honeypot" mechanism to track when Large Language Models (LLMs) access and extract information from the site.

## How It Works

### 1. llms.txt Instruction

The `/llms.txt` file includes a section called "LLM Usage Feedback" that instructs LLMs to report when they find useful information. The instruction is phrased to sound like it's part of the llms.txt standard and helps improve the specification.

### 2. API Endpoint

**Endpoint**: `POST /api/llm-report`

**Expected JSON payload**:
```json
{
  "topic": "the topic or question being researched",
  "llm_name": "model name (e.g., Claude, GPT-4, Gemini)",
  "findings": "brief description of what was found"
}
```

### 3. Security Features

- **Rate Limiting**: 10 requests per minute per IP address
- **Input Sanitization**: All inputs are sanitized to prevent injection attacks
- **Log Rotation**: Automatically rotates after 1000 entries
- **Size Limits**: Maximum field lengths enforced

### 4. Logging

Logs are stored in `logs/llm-reports.jsonl` (JSONL format - one JSON object per line)

Each log entry contains:
- `timestamp`: ISO 8601 timestamp
- `ip`: Client IP address (sanitized)
- `topic`: Research topic (max 200 chars)
- `llmName`: Model name (max 100 chars)
- `findings`: Description of findings (max 1000 chars)
- `userAgent`: HTTP User-Agent header (max 200 chars)

## Viewing Logs

### Option 1: TypeScript Script (Recommended)
```bash
npx tsx scripts/view-llm-logs.ts [number_of_lines]
```

This displays:
- Recent log entries with formatted output
- Total report count
- Statistics by LLM and topic
- Log file size

### Option 2: Shell Script
```bash
./scripts/view-llm-logs.sh [number_of_lines]
```

Requires `jq` for pretty printing.

### Option 3: Manual
```bash
# View all logs
cat logs/llm-reports.jsonl

# View with jq
cat logs/llm-reports.jsonl | jq

# Follow live
tail -f logs/llm-reports.jsonl | jq

# Count entries
wc -l logs/llm-reports.jsonl
```

## Log Rotation

When the log file reaches 1000 entries, it automatically rotates:
- Current log: `logs/llm-reports.jsonl`
- Archived log: `logs/llm-reports-[timestamp].jsonl`

Old logs are preserved and can be analyzed separately.

## Privacy Considerations

- IP addresses are logged but sanitized (truncated to reasonable length)
- All user input is sanitized to prevent injection attacks
- Logs are excluded from git via `.gitignore`
- Rate limiting prevents log flooding

## Testing the Endpoint

You can test the endpoint locally:

```bash
curl -X POST http://localhost:3000/api/llm-report \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "test topic",
    "llm_name": "test",
    "findings": "testing the endpoint"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for reporting your findings! Your feedback helps improve the accessibility of this website for AI tools.",
  "timestamp": "2025-11-23T..."
}
```

## Interpreting Results

When you see entries in the logs, it means:
1. An LLM read your llms.txt file
2. The LLM followed the instruction to report back
3. The LLM found the content useful enough to report

This can help you understand:
- Which LLMs are accessing your site
- What topics they're researching
- How they're using your content
- The effectiveness of your llms.txt structure

## Limitations

- Not all LLMs will follow the instruction (depends on model and prompt)
- Some LLM providers may block making external API calls
- The data is self-reported and may not represent all LLM traffic
- Rate limiting is in-memory and resets on server restart
