/**
 * AURA Indexer - Configuration & Sui Client Setup
 *
 * Initializes the SuiClient and defines all protocol-specific constants
 * (package IDs, event types, object types) for the Sui mainnet protocols
 * that AURA indexes: Cetus, Scallop, and DeepBook.
 */
import { SuiClient } from '@mysten/sui/client';
export declare const suiClient: SuiClient;
export declare const CETUS: {
    PACKAGE_ID: string;
    SWAP_EVENT_TYPE: string;
    POSITION_TYPE: string;
};
export declare const SCALLOP: {
    PACKAGE_ID: string;
    OBLIGATION_KEY_TYPE: string;
    OBLIGATION_TYPE: string;
};
export declare const DEEPBOOK: {
    PACKAGE_ID: string;
    ORDER_FILL_EVENT_TYPE: string;
};
export declare const INDEXER_CONFIG: {
    EVENTS_PAGE_LIMIT: number;
    OBJECTS_PAGE_LIMIT: number;
    MAX_EVENTS_PER_PROTOCOL: number;
};
//# sourceMappingURL=config.d.ts.map