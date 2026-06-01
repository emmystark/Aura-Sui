/**
 * AURA Indexer - DeepBook V3 Protocol Fetcher
 * 
 * Extracts DeepBook-specific data from the shared transaction set.
 * Filters for OrderFilled events where the user is maker or taker.
 * No additional RPC calls needed — pure in-memory filtering.
 */

import { DEEPBOOK } from '../config.js';
import type { DeepBookOrderFill, DeepBookUserData } from '../types/index.js';
import type { UserTransaction } from './scanner.js';

/**
 * Extracts DeepBook order fill events from the pre-fetched transaction set.
 */
function extractOrderFills(userAddress: string, transactions: UserTransaction[]): { makerFills: DeepBookOrderFill[]; takerFills: DeepBookOrderFill[] } {
  const makerFills: DeepBookOrderFill[] = [];
  const takerFills: DeepBookOrderFill[] = [];

  for (const tx of transactions) {
    for (const event of tx.events) {
      if (event.type === DEEPBOOK.ORDER_FILL_EVENT_TYPE) {
        const parsed = event.parsedJson;
        const makerAddress = String(parsed.maker_address || parsed.makerAddress || '');
        const takerAddress = String(parsed.taker_address || parsed.takerAddress || event.sender || '');

        const fill: DeepBookOrderFill = {
          txDigest: tx.digest,
          timestampMs: tx.timestampMs,
          poolId: String(parsed.pool_id || parsed.poolId || ''),
          makerAddress,
          takerAddress,
          baseQuantity: String(parsed.base_quantity || parsed.baseQuantity || '0'),
          quoteQuantity: String(parsed.quote_quantity || parsed.quoteQuantity || '0'),
          isBid: (parsed.is_bid as boolean) || false,
          raw: parsed,
        };

        if (makerAddress === userAddress) {
          makerFills.push(fill);
        }
        if (takerAddress === userAddress) {
          takerFills.push(fill);
        }
        // If user is the tx sender but not explicitly listed, count as taker
        if (makerAddress !== userAddress && takerAddress !== userAddress) {
          takerFills.push(fill);
        }
      }
    }
  }

  console.log(`  [DeepBook] Extracted ${makerFills.length} maker fills, ${takerFills.length} taker fills.`);
  return { makerFills, takerFills };
}

/**
 * Main entry point: Extracts DeepBook data from shared transactions.
 */
export function fetchDeepBookData(userAddress: string, transactions: UserTransaction[]): DeepBookUserData {
  console.log('[DeepBook] Processing...');

  const { makerFills, takerFills } = extractOrderFills(userAddress, transactions);

  return { makerFills, takerFills };
}
