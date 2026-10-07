export const demoProblem = {
  title: "Transaction Deduplication",
  description: `You receive a list of transactions. Each transaction has the following structure:

Transaction {
    transactionId: string
    userId: string
    amount: number
    timestamp: string
}

Write a function that removes duplicate transactions based on transactionId.`,
  requirements: [
    "Keep only the latest occurrence of a transaction ID (the one that appears last in the input).",
    "Transaction IDs may be null or empty — treat each such transaction as unique (do not deduplicate them).",
    "Amount can be positive, zero, or negative.",
    "Input may be empty or null — return an empty collection in that case.",
    "The original ordering of the latest occurrences should be preserved.",
    "Do not modify the original input collection.",
    "Return an empty collection when there is no valid transaction.",
    "The solution should be efficient for large inputs.",
  ],
  inputFormat: `Read transactions from stdin, one per line, as JSON objects:

{"transactionId": "tx1", "userId": "u1", "amount": 100, "timestamp": "2024-01-01T10:00:00Z"}
{"transactionId": "tx2", "userId": "u2", "amount": 50, "timestamp": "2024-01-01T11:00:00Z"}

An empty line or EOF signals the end of input.`,
  outputFormat: `Print each deduplicated transaction as a JSON object, one per line, in the preserved order.`,
  example: {
    input: `{"transactionId": "tx1", "userId": "u1", "amount": 100, "timestamp": "2024-01-01T10:00:00Z"}
{"transactionId": "tx2", "userId": "u2", "amount": 50, "timestamp": "2024-01-01T11:00:00Z"}
{"transactionId": "tx1", "userId": "u1", "amount": 150, "timestamp": "2024-01-01T12:00:00Z"}
{"transactionId": null, "userId": "u3", "amount": 25, "timestamp": "2024-01-01T13:00:00Z"}
{"transactionId": "tx2", "userId": "u2", "amount": 75, "timestamp": "2024-01-01T14:00:00Z"}
{"transactionId": "", "userId": "u4", "amount": 0, "timestamp": "2024-01-01T15:00:00Z"}`,
    output: `{"transactionId": "tx1", "userId": "u1", "amount": 150, "timestamp": "2024-01-01T12:00:00Z"}
{"transactionId": null, "userId": "u3", "amount": 25, "timestamp": "2024-01-01T13:00:00Z"}
{"transactionId": "tx2", "userId": "u2", "amount": 75, "timestamp": "2024-01-01T14:00:00Z"}
{"transactionId": "", "userId": "u4", "amount": 0, "timestamp": "2024-01-01T15:00:00Z"}`,
  },
  constraints: [
    'Transactions with null or empty transactionId are always kept (treated as unique).',
    "Duplicate detection is based solely on transactionId — not on userId, amount, or timestamp.",
    "The output order must match the order of the last occurrence of each transactionId in the input.",
    "There may be up to 100,000 transactions.",
    "The solution should run in O(n) time and O(n) space.",
  ],
  evaluation: [
    "Understanding of HashMap / collections.",
    "Handling of null and invalid data.",
    "Understanding of ordering.",
    "Whether the candidate validates AI-generated assumptions.",
    "Time and space complexity.",
  ],
};

export const sampleInput = `{"transactionId": "tx1", "userId": "u1", "amount": 100, "timestamp": "2024-01-01T10:00:00Z"}
{"transactionId": "tx2", "userId": "u2", "amount": 50, "timestamp": "2024-01-01T11:00:00Z"}
{"transactionId": "tx1", "userId": "u1", "amount": 150, "timestamp": "2024-01-01T12:00:00Z"}
{"transactionId": null, "userId": "u3", "amount": 25, "timestamp": "2024-01-01T13:00:00Z"}
{"transactionId": "tx2", "userId": "u2", "amount": 75, "timestamp": "2024-01-01T14:00:00Z"}
{"transactionId": "", "userId": "u4", "amount": 0, "timestamp": "2024-01-01T15:00:00Z"}`;

export type Problem = typeof demoProblem;
