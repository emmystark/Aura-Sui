/**
 * AURA Indexer - TypeScript Type Definitions
 *
 * These interfaces define the shape of the raw data we extract from
 * each Sui DeFi protocol. They represent the "unprocessed" fetched data.
 *
 * A separate "Derivation Engine" phase (to be built later) will transform
 * these raw types into the standardized AURA Risk Profile JSON.
 */
/** Raw data from a single Cetus swap event */
export interface CetusSwapEvent {
    /** Transaction digest where this swap occurred */
    txDigest: string;
    /** Timestamp in milliseconds */
    timestampMs: string | null;
    /** The pool where the swap happened */
    pool: string;
    /** Address of the user who performed the swap */
    sender: string;
    /** Whether the swap direction was A-to-B or B-to-A */
    atob: boolean;
    /** Amount of token A involved */
    amountA: string;
    /** Amount of token B involved */
    amountB: string;
    /** Raw parsed JSON from the event (for any extra fields) */
    raw: Record<string, unknown>;
}
/** Raw data about a Cetus LP Position NFT owned by the user */
export interface CetusPosition {
    /** The object ID of this position NFT */
    objectId: string;
    /** The full type string (includes pool type params) */
    type: string;
    /** The pool this position belongs to */
    pool: string;
    /** Lower tick bound of the concentrated liquidity range */
    tickLower: string;
    /** Upper tick bound of the concentrated liquidity range */
    tickUpper: string;
    /** Amount of liquidity in this position */
    liquidity: string;
}
/** Aggregated Cetus data for a user */
export interface CetusUserData {
    /** List of swap events performed by the user */
    swaps: CetusSwapEvent[];
    /** List of active LP positions owned by the user */
    positions: CetusPosition[];
}
/** Raw data about a Scallop Obligation (lending position) */
export interface ScallopObligation {
    /** The object ID of the ObligationKey (owned by the user) */
    keyObjectId: string;
    /** The object ID of the linked Obligation (shared object) */
    obligationObjectId: string | null;
    /** Raw content fields from the Obligation object */
    fields: Record<string, unknown> | null;
}
/** Aggregated Scallop data for a user */
export interface ScallopUserData {
    /** List of obligations (lending positions) the user holds */
    obligations: ScallopObligation[];
}
/** Raw data from a single DeepBook order fill event */
export interface DeepBookOrderFill {
    /** Transaction digest */
    txDigest: string;
    /** Timestamp in milliseconds */
    timestampMs: string | null;
    /** The pool (trading pair) where the order was filled */
    poolId: string;
    /** The maker address */
    makerAddress: string;
    /** The taker address */
    takerAddress: string;
    /** Base asset quantity filled */
    baseQuantity: string;
    /** Quote asset quantity filled */
    quoteQuantity: string;
    /** Whether this was a bid (buy) or ask (sell) */
    isBid: boolean;
    /** Raw parsed JSON from the event */
    raw: Record<string, unknown>;
}
/** Aggregated DeepBook data for a user */
export interface DeepBookUserData {
    /** Order fill events where the user was the maker */
    makerFills: DeepBookOrderFill[];
    /** Order fill events where the user was the taker */
    takerFills: DeepBookOrderFill[];
}
/** The complete raw on-chain footprint for a single user address */
export interface RawUserProfile {
    /** The Sui address being indexed */
    userAddress: string;
    /** Timestamp when this profile was fetched */
    fetchedAt: string;
    /** Data from Cetus (swaps + LP positions) */
    cetus: CetusUserData;
    /** Data from Scallop (lending obligations) */
    scallop: ScallopUserData;
    /** Data from DeepBook (order book trades) */
    deepbook: DeepBookUserData;
}
//# sourceMappingURL=index.d.ts.map