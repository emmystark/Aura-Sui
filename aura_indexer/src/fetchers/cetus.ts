/**
 * AURA Indexer - Cetus Protocol Fetcher
 * 
 * Extracts Cetus-specific data from the shared transaction set:
 * 1. SWAP EVENTS — Filters for Cetus SwapEvent types from user transactions.
 * 2. LP POSITIONS — Queries user's owned Cetus Position NFTs directly.
 */

import { suiClient, CETUS, INDEXER_CONFIG } from '../config.js';
import type { CetusSwapEvent, CetusPosition, CetusUserData } from '../types/index.js';
import type { UserTransaction } from './scanner.js';

/**
 * Extracts Cetus swap events from the pre-fetched transaction set.
 * No additional RPC calls needed — pure in-memory filtering.
 */
function extractSwapEvents(transactions: UserTransaction[]): CetusSwapEvent[] {
  const swaps: CetusSwapEvent[] = [];

  for (const tx of transactions) {
    for (const event of tx.events) {
      if (event.type === CETUS.SWAP_EVENT_TYPE) {
        const parsed = event.parsedJson;

        swaps.push({
          txDigest: tx.digest,
          timestampMs: tx.timestampMs,
          pool: String(parsed.pool || ''),
          sender: event.sender,
          atob: (parsed.atob as boolean) || false,
          amountA: String(parsed.amount_a || parsed.amountA || '0'),
          amountB: String(parsed.amount_b || parsed.amountB || '0'),
          raw: parsed,
        });
      }
    }
  }

  console.log(`  [Cetus] Extracted ${swaps.length} swap events from transaction history.`);
  return swaps;
}

/**
 * Fetches all Cetus LP Position NFTs owned by the user.
 * This still requires a direct RPC call since positions are on-chain objects.
 */
async function fetchPositions(userAddress: string): Promise<CetusPosition[]> {
  const positions: CetusPosition[] = [];
  let cursor: string | null | undefined = null;
  let hasMore = true;

  console.log(`  [Cetus] Fetching LP positions...`);

  while (hasMore) {
    const response = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: CETUS.POSITION_TYPE,
      },
      options: {
        showType: true,
        showContent: true,
      },
      cursor: cursor ?? undefined,
      limit: INDEXER_CONFIG.OBJECTS_PAGE_LIMIT,
    });

    for (const obj of response.data) {
      if (obj.data && obj.data.content && obj.data.content.dataType === 'moveObject') {
        const fields = obj.data.content.fields as Record<string, unknown>;

        positions.push({
          objectId: obj.data.objectId,
          type: obj.data.type ?? '',
          pool: String(fields.pool || ''),
          tickLower: String(fields.tick_lower_index ?? fields.tickLowerIndex ?? '0'),
          tickUpper: String(fields.tick_upper_index ?? fields.tickUpperIndex ?? '0'),
          liquidity: String(fields.liquidity || '0'),
        });
      }
    }

    hasMore = response.hasNextPage;
    cursor = response.nextCursor ?? null;
  }

  console.log(`  [Cetus] Found ${positions.length} LP positions.`);
  return positions;
}

/**
 * Main entry point: Extracts Cetus data from shared transactions + fetches positions.
 */
export async function fetchCetusData(userAddress: string, transactions: UserTransaction[]): Promise<CetusUserData> {
  console.log('[Cetus] Processing...');

  const [swaps, positions] = await Promise.all([
    Promise.resolve(extractSwapEvents(transactions)),
    fetchPositions(userAddress),
  ]);

  return { swaps, positions };
}
