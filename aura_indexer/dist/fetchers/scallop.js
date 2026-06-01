/**
 * AURA Indexer - Scallop Protocol Fetcher
 *
 * Fetches lending/borrowing position data from the Scallop protocol.
 *
 * Scallop Architecture:
 * - An "Obligation" is a SHARED object that holds collateral + debt data.
 * - An "ObligationKey" is an OWNED NFT that proves the user owns that Obligation.
 * - To read a user's lending data, we:
 *   1. Query getOwnedObjects for ObligationKey NFTs belonging to the user.
 *   2. Extract the linked Obligation object ID from the key.
 *   3. Fetch the full Obligation shared object to read collateral/debt fields.
 *
 * This two-step approach is necessary because shared objects cannot be
 * discovered via getOwnedObjects directly — only owned objects can.
 *
 * Data Flow:
 *   getOwnedObjects(ObligationKey) → extract obligation ID → getObject(Obligation)
 */
import { suiClient, SCALLOP, INDEXER_CONFIG } from '../config.js';
/**
 * Step 1: Find all ObligationKey NFTs owned by the user.
 * Each key links to exactly one Obligation shared object.
 */
async function fetchObligationKeys(userAddress) {
    const keys = [];
    let cursor = null;
    let hasMore = true;
    console.log(`  [Scallop] Fetching ObligationKey NFTs for ${userAddress}...`);
    while (hasMore) {
        const response = await suiClient.getOwnedObjects({
            owner: userAddress,
            filter: {
                StructType: SCALLOP.OBLIGATION_KEY_TYPE,
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
                keys.push({
                    keyObjectId: obj.data.objectId,
                    fields: obj.data.content.fields,
                });
            }
        }
        hasMore = response.hasNextPage;
        cursor = response.nextCursor ?? null;
    }
    console.log(`  [Scallop] Found ${keys.length} ObligationKey(s).`);
    return keys;
}
/**
 * Step 2: Given an Obligation object ID, fetch its full content.
 * This reads the shared object's collateral and debt fields.
 */
async function fetchObligationObject(obligationId) {
    console.log(`  [Scallop] Fetching Obligation object ${obligationId}...`);
    try {
        const response = await suiClient.getObject({
            id: obligationId,
            options: {
                showContent: true,
                showType: true,
            },
        });
        if (response.data && response.data.content && response.data.content.dataType === 'moveObject') {
            return response.data.content.fields;
        }
        return null;
    }
    catch (error) {
        console.error(`  [Scallop] Error fetching obligation ${obligationId}:`, error);
        return null;
    }
}
/**
 * Main entry point: Fetches all Scallop lending data for a given user.
 *
 * The process:
 * 1. Find all ObligationKey NFTs owned by the user.
 * 2. Extract the linked Obligation ID from each key's fields.
 * 3. Fetch the full Obligation object to get collateral/debt details.
 */
export async function fetchScallopData(userAddress) {
    console.log('[Scallop] Starting data fetch...');
    const keys = await fetchObligationKeys(userAddress);
    const obligations = [];
    for (const key of keys) {
        // The ObligationKey typically contains a field pointing to the Obligation ID.
        // The field name varies but is commonly "ownership" or "obligation_id".
        const obligationId = key.fields.obligation_id
            || key.fields.ownership?.of
            || null;
        let fields = null;
        if (obligationId) {
            fields = await fetchObligationObject(obligationId);
        }
        else {
            console.warn(`  [Scallop] Could not extract obligation ID from key ${key.keyObjectId}. Raw fields:`, key.fields);
        }
        obligations.push({
            keyObjectId: key.keyObjectId,
            obligationObjectId: obligationId,
            fields: fields,
        });
    }
    console.log(`[Scallop] Fetched ${obligations.length} obligation(s) with details.`);
    return { obligations };
}
//# sourceMappingURL=scallop.js.map