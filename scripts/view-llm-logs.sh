#!/bin/bash
# View LLM honeypot logs
# Usage: ./scripts/view-llm-logs.sh [number_of_lines]

LOG_FILE="logs/llm-reports.jsonl"
LINES=${1:-50}

if [ ! -f "$LOG_FILE" ]; then
    echo "No logs found yet. The log file will be created when the first LLM report is received."
    echo "Expected location: $LOG_FILE"
    exit 0
fi

echo "=== Last $LINES LLM Reports ==="
echo ""

tail -n "$LINES" "$LOG_FILE" | while IFS= read -r line; do
    # Pretty print JSON with jq if available, otherwise just echo
    if command -v jq &> /dev/null; then
        echo "$line" | jq '.'
    else
        echo "$line"
    fi
    echo "---"
done

echo ""
echo "Total reports: $(wc -l < "$LOG_FILE")"
echo ""
echo "To view all logs: cat $LOG_FILE | jq"
echo "To follow live: tail -f $LOG_FILE | jq"
