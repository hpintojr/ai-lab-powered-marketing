import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const path = process.argv[2];
if (!path) throw new Error('Provide the path to one Codex session JSONL file.');

let first, cutoff, usage;
let finishedMs = 0;
let activeFrom;
let finishedCount = 0;
const models = new Set();

for await (const line of createInterface({ input: createReadStream(path), crlfDelay: Infinity })) {
  let row;
  try { row = JSON.parse(line); } catch { continue; }
  const { timestamp, payload: event } = row;
  if (timestamp) first ??= timestamp;
  if (row.type === 'turn_context' && event?.model) models.add(event.model + (event.effort ? ' (' + event.effort + ')' : ''));
  if (event?.type === 'task_started') activeFrom = timestamp;
  if (event?.type === 'task_complete') {
    if (Number.isFinite(event.duration_ms)) finishedMs += event.duration_ms;
    else if (activeFrom && timestamp) finishedMs += Date.parse(timestamp) - Date.parse(activeFrom);
    finishedCount++;
    activeFrom = undefined;
  }
  if (event?.type === 'token_count' && event.info?.total_token_usage) {
    usage = event.info.total_token_usage;
    cutoff = timestamp;
  }
}
if (!first || !cutoff || !usage) throw new Error('No cumulative usage snapshot in this log.');
const activeMs = activeFrom ? Math.max(0, Date.parse(cutoff) - Date.parse(activeFrom)) : 0;
console.log(JSON.stringify({
  first, cutoff, models: [...models],
  elapsedSeconds: Math.round((Date.parse(cutoff) - Date.parse(first)) / 1000),
  finishedTurns: finishedCount,
  finishedTurnSeconds: Math.round(finishedMs / 1000),
  activeTurnSecondsAtCutoff: activeMs ? Math.round(activeMs / 1000) : null,
  input: usage.input_tokens,
  cachedInput: usage.cached_input_tokens,
  uncachedInput: usage.input_tokens - usage.cached_input_tokens,
  output: usage.output_tokens,
  reasoningOutput: usage.reasoning_output_tokens,
  total: usage.total_tokens,
}, null, 2));
