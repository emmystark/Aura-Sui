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
import type { CetusUserData } from '../types/index.js';
/**
 * Main entry point: Fetches all Cetus data for a given user.
 */
export declare function fetchCetusData(userAddress: string): Promise<CetusUserData>;
//# sourceMappingURL=cetus.d.ts.map