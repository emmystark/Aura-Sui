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
import type { ScallopUserData } from '../types/index.js';
/**
 * Main entry point: Fetches all Scallop lending data for a given user.
 *
 * The process:
 * 1. Find all ObligationKey NFTs owned by the user.
 * 2. Extract the linked Obligation ID from each key's fields.
 * 3. Fetch the full Obligation object to get collateral/debt details.
 */
export declare function fetchScallopData(userAddress: string): Promise<ScallopUserData>;
//# sourceMappingURL=scallop.d.ts.map