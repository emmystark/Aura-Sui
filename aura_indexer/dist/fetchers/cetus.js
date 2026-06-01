/**
 * AURA Indexer - Cetus Protocol Fetcher
 *
 * Fetches two types of data from the Cetus concentrated liquidity DEX:
 *
 * 1. SWAP EVENTS (Historical): Instead of scanning ALL Cetus events globally
 *    (which is millions on mainnet), we query the user's transactions and
 *    extract Cetus-specific events from them. This is orders of magnitude faster.
 *
 * 2. LP POSITIONS (Current State): Queries the user's owned objects to find
 *    Cetus Position NFTs. These represent active concentrated liquidity
 *    positions, telling us which pools the user is providing liquidity to
 *    and their tick ranges (risk exposure).
 *
 * Data Flow:
 *   queryTransactionBlocks(FromAddress) → filter Cetus events → CetusUserData
 *   getOwnedObjects(StructType: Position) → CetusPosition[]
 */
import { suiClient, CETUS, INDEXER_CONFIG } from '../config.js';
/**
 * Fetches Cetus swap events by scanning the user's own transactions.
 *
 * Why not queryEvents with MoveEventType?
 *   On mainnet, Cetus emits millions of swap events globally. Scanning all
 *   of them and filtering client-side for one user is impossibly slow.
 *   Instead, we query the user's transactions (which is a small set) and
 *   extract Cetus swap events from them.
 */
async function fetchSwapEvents(userAddress) {
    const swaps = [];
    let cursor = null;
    let hasMore = true;
    let pagesScanned = 0;
    const MAX_PAGES = 20; // Safety limit to avoid infinite pagination
    console.log(`  [Cetus] Fetching user transactions to find swap events...`);
    while (hasMore && pagesScanned < MAX_PAGES) {
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
            if (!tx.events)
                continue;
            for (const event of tx.events) {
                // Only pick up Cetus swap events
                if (event.type === CETUS.SWAP_EVENT_TYPE) {
                    const parsed = event.parsedJson;
                    swaps.push({
                        txDigest: tx.digest,
                        timestampMs: tx.timestampMs ?? null,
                        pool: String(parsed.pool || ''),
                        sender: event.sender,
                        atob: parsed.atob || false,
                        amountA: String(parsed.amount_a || parsed.amountA || '0'),
                        amountB: String(parsed.amount_b || parsed.amountB || '0'),
                        raw: parsed,
                    });
                }
            }
        }
        hasMore = response.hasNextPage;
        cursor = response.nextCursor ?? null;
    }
    console.log(`  [Cetus] Found ${swaps.length} swap events across ${pagesScanned} page(s) of transactions.`);
    return swaps;
}
/**
 * Fetches all Cetus LP Position NFTs owned by the user.
 * These are on-chain objects, not events — they represent current state.
 */
async function fetchPositions(userAddress) {
    const positions = [];
    let cursor = null;
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
                const fields = obj.data.content.fields;
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
 * Main entry point: Fetches all Cetus data for a given user.
 */
export async function fetchCetusData(userAddress) {
    console.log('[Cetus] Starting data fetch...');
    const [swaps, positions] = await Promise.all([
        fetchSwapEvents(userAddress),
        fetchPositions(userAddress),
    ]);
    return { swaps, positions };
}
//# sourceMappingURL=cetus.js.map