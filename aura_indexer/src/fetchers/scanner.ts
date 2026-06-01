/**
 * AURA Indexer - Shared Transaction Scanner
 * 
 * Fetches the user's transaction history from Sui ONCE and shares it
 * across all protocol fetchers. This avoids duplicate RPC calls and
 * dramatically speeds up the indexing process.
 * 
 * Each protocol fetcher then simply filters this shared set for its
 * specific event types, with zero additional network calls.
 */

import { suiClient, INDEXER_CONFIG } from '../config.js';
import type { SuiTransactionBlockResponse } from '@mysten/sui/client';

export interface UserTransaction {
  digest: string;
  timestampMs: string | null;
  events: Array<{
    type: string;
    sender: string;
    parsedJson: Record<string, unknown>;
  }>;
}

/**
 * Fetches all recent transactions from the given user address.
 * Returns a flattened, simplified array that protocol fetchers can filter.
 */
export async function fetchUserTransactions(userAddress: string, maxPages: number = 10): Promise<UserTransaction[]> {
  const transactions: UserTransaction[] = [];
  let cursor: string | null | undefined = null;
  let hasMore = true;
  let pagesScanned = 0;

  console.log(`[Scanner] Fetching transaction history for ${userAddress}...`);

  while (hasMore && pagesScanned < maxPages) {
    pagesScanned++;

    const response = await suiClient.queryTransactionBlocks({
      filter: {
        FromAddress: userAddress,
      },
      options: {
        showEvents: true,
      },
      cursor: cursor ?? undefined,
      limit: INDEXER_CONFIG.EVENTS_PAGE_LIMIT,
      order: 'descending',
    });

    for (const tx of response.data) {
      const events = (tx.events || []).map((event) => ({
        type: event.type,
        sender: event.sender,
        parsedJson: (event.parsedJson as Record<string, unknown>) || {},
      }));

      transactions.push({
        digest: tx.digest,
        timestampMs: tx.timestampMs ?? null,
        events,
      });
    }

    hasMore = response.hasNextPage;
    cursor = response.nextCursor ?? null;

    // Log progress every few pages
    if (pagesScanned % 5 === 0) {
      console.log(`[Scanner] ...scanned ${pagesScanned} pages (${transactions.length} transactions so far)`);
    }
  }

  console.log(`[Scanner] Done. Fetched ${transactions.length} transactions across ${pagesScanned} page(s).`);
  return transactions;
}
