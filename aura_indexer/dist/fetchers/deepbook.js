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
import { suiClient, DEEPBOOK, INDEXER_CONFIG } from '../config.js';
/**
 * Fetches DeepBook OrderFilled events by scanning the user's transactions.
 * The user could appear as either the maker or the taker in a fill event.
 */
async function fetchOrderFills(userAddress) {
    const makerFills = [];
    const takerFills = [];
    let cursor = null;
    let hasMore = true;
    let pagesScanned = 0;
    const MAX_PAGES = 20; // Safety limit
    console.log(`  [DeepBook] Fetching user transactions to find order fills...`);
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
                // Only pick up DeepBook order fill events
                if (event.type === DEEPBOOK.ORDER_FILL_EVENT_TYPE) {
                    const parsed = event.parsedJson;
                    const makerAddress = String(parsed.maker_address || parsed.makerAddress || '');
                    const takerAddress = String(parsed.taker_address || parsed.takerAddress || event.sender || '');
                    const fill = {
                        txDigest: tx.digest,
                        timestampMs: tx.timestampMs ?? null,
                        poolId: String(parsed.pool_id || parsed.poolId || ''),
                        makerAddress,
                        takerAddress,
                        baseQuantity: String(parsed.base_quantity || parsed.baseQuantity || '0'),
                        quoteQuantity: String(parsed.quote_quantity || parsed.quoteQuantity || '0'),
                        isBid: parsed.is_bid || false,
                        raw: parsed,
                    };
                    if (makerAddress === userAddress) {
                        makerFills.push(fill);
                    }
                    if (takerAddress === userAddress) {
                        takerFills.push(fill);
                    }
                    // If the user is the tx sender and not explicitly listed, count as taker
                    if (makerAddress !== userAddress && takerAddress !== userAddress) {
                        takerFills.push(fill);
                    }
                }
            }
        }
        hasMore = response.hasNextPage;
        cursor = response.nextCursor ?? null;
    }
    console.log(`  [DeepBook] Found ${makerFills.length} maker fills, ${takerFills.length} taker fills across ${pagesScanned} page(s).`);
    return { makerFills, takerFills };
}
/**
 * Main entry point: Fetches all DeepBook trading data for a given user.
 */
export async function fetchDeepBookData(userAddress) {
    console.log('[DeepBook] Starting data fetch...');
    const { makerFills, takerFills } = await fetchOrderFills(userAddress);
    return { makerFills, takerFills };
}
//# sourceMappingURL=deepbook.js.map