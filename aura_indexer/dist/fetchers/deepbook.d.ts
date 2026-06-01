/**
 * AURA Indexer - DeepBook V3 Protocol Fetcher
 *
 * Fetches trading data from DeepBook, Sui's native on-chain order book (CLOB).
 *
 * Strategy:
 *   Like Cetus, we do NOT scan all global DeepBook events (there are millions).
 *   Instead, we scan the user's own transaction history and extract DeepBook
 *   OrderFilled events from it. This is fast and efficient on mainnet.
 *
 * Data Flow:
 *   queryTransactionBlocks(FromAddress) → filter DeepBook events → DeepBookUserData
 */
import type { DeepBookUserData } from '../types/index.js';
/**
 * Main entry point: Fetches all DeepBook trading data for a given user.
 */
export declare function fetchDeepBookData(userAddress: string): Promise<DeepBookUserData>;
//# sourceMappingURL=deepbook.d.ts.map