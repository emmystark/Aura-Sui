/**
 * AURA Indexer - Configuration & Sui Client Setup
 * 
 * Initializes the SuiClient and defines all protocol-specific constants
 * (package IDs, event types, object types) for the Sui mainnet protocols
 * that AURA indexes: Cetus, Scallop, and DeepBook.
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Sui Client
// ---------------------------------------------------------------------------

const network = (process.env.SUI_NETWORK as 'testnet' | 'mainnet') || 'testnet';
const rpcUrl = process.env.SUI_RPC_URL || getFullnodeUrl(network);

export const suiClient = new SuiClient({ url: rpcUrl });

console.log(`[Config] Connected to Sui ${network} via ${rpcUrl}`);

// ---------------------------------------------------------------------------
// Protocol Constants — Cetus (Concentrated Liquidity DEX)
// ---------------------------------------------------------------------------
// Cetus uses a CLMM (Concentrated Liquidity Market Maker) model.
// Swap events are emitted by the pool module.
// LP positions are NFT objects owned by the user.

export const CETUS = {
  // The core CLMM package on Sui mainnet
  PACKAGE_ID: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb',

  // The event type emitted when a swap occurs
  // Format: {packageId}::pool::SwapEvent
  SWAP_EVENT_TYPE: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::pool::SwapEvent',

  // The struct type for Cetus LP Position NFTs owned by users
  // We use this to filter getOwnedObjects results
  POSITION_TYPE: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::position::Position',
};

// ---------------------------------------------------------------------------
// Protocol Constants — Scallop (Lending/Borrowing)
// ---------------------------------------------------------------------------
// Scallop uses an Obligation shared object to track user deposits and debts.
// Users hold an ObligationKey (owned NFT) that proves ownership.
// We query ObligationKey objects owned by the user, then fetch the linked
// Obligation shared object to read collateral and debt fields.

export const SCALLOP = {
  // The core Scallop protocol package on Sui mainnet
  PACKAGE_ID: '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf',

  // The struct type for ObligationKey NFTs (owned by the user)
  OBLIGATION_KEY_TYPE: '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::obligation::ObligationKey',

  // The struct type for Obligation shared objects
  OBLIGATION_TYPE: '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::obligation::Obligation',
};

// ---------------------------------------------------------------------------
// Protocol Constants — DeepBook V3 (On-Chain CLOB)
// ---------------------------------------------------------------------------
// DeepBook is Sui's native central limit order book.
// We query trade/order events emitted by the DeepBook package.

export const DEEPBOOK = {
  // The DeepBookV3 package on Sui mainnet
  PACKAGE_ID: '0x337f4f4f6567fcd778d5454f27c16c70e2f274cc6377ea6249ddf491482ef497',

  // Order fill event — emitted when a trade is executed
  ORDER_FILL_EVENT_TYPE: '0x337f4f4f6567fcd778d5454f27c16c70e2f274cc6377ea6249ddf491482ef497::pool::OrderFilled',
};

// ---------------------------------------------------------------------------
// Indexer Settings
// ---------------------------------------------------------------------------

export const INDEXER_CONFIG = {
  // Maximum number of events to fetch per query page
  EVENTS_PAGE_LIMIT: 50,

  // Maximum number of objects to fetch per query page
  OBJECTS_PAGE_LIMIT: 50,

  // Maximum total events to collect per protocol (to prevent runaway queries)
  MAX_EVENTS_PER_PROTOCOL: 200,
};
