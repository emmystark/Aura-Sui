/**
 * AURA Indexer - Main Entry Point
 * 
 * Orchestrator that:
 * 1. Fetches the user's transaction history ONCE via the shared scanner.
 * 2. Passes that shared set to each protocol fetcher for in-memory filtering.
 * 3. Runs object-based queries (Scallop obligations, Cetus positions) in parallel.
 * 4. Aggregates everything into a single RawUserProfile.
 * 
 * Usage:
 *   npx tsx src/index.ts <SUI_ADDRESS>
 */

import { fetchUserTransactions } from './fetchers/scanner.js';
import { fetchCetusData } from './fetchers/cetus.js';
import { fetchScallopData } from './fetchers/scallop.js';
import { fetchDeepBookData } from './fetchers/deepbook.js';
import type { RawUserProfile } from './types/index.js';

async function main(): Promise<void> {
  const userAddress = process.argv[2];

  if (!userAddress) {
    console.error('Usage: npx tsx src/index.ts <SUI_ADDRESS>');
    console.error('Example: npx tsx src/index.ts 0x008e9c621f4fdb210b873aab59a1e5bf32ddb1d33ee85eb069b348c234465106');
    process.exit(1);
  }

  if (!userAddress.startsWith('0x') || userAddress.length < 10) {
    console.error(`Error: "${userAddress}" does not look like a valid Sui address.`);
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('AURA INDEXER — Raw Data Fetcher');
  console.log('='.repeat(60));
  console.log(`Target Address: ${userAddress}`);
  console.log(`Timestamp:      ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log('');

  // Step 1: Fetch user's transaction history ONCE
  const transactions = await fetchUserTransactions(userAddress);

  console.log('');

  // Step 2: Run all protocol fetchers
  // - Cetus & DeepBook use the shared transaction set (in-memory filtering)
  // - Scallop queries owned objects directly (separate RPC call)
  const [cetusData, scallopData] = await Promise.all([
    fetchCetusData(userAddress, transactions),
    fetchScallopData(userAddress),
  ]);

  // DeepBook is synchronous (pure in-memory filtering)
  const deepbookData = fetchDeepBookData(userAddress, transactions);

  // Aggregate into a single profile
  const profile: RawUserProfile = {
    userAddress,
    fetchedAt: new Date().toISOString(),
    cetus: cetusData,
    scallop: scallopData,
    deepbook: deepbookData,
  };

  // Print summary
  console.log('');
  console.log('='.repeat(60));
  console.log('FETCH SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Transactions Scanned: ${transactions.length}`);
  console.log(`Cetus Swaps:                ${profile.cetus.swaps.length}`);
  console.log(`Cetus LP Positions:         ${profile.cetus.positions.length}`);
  console.log(`Scallop Obligations:        ${profile.scallop.obligations.length}`);
  console.log(`DeepBook Maker Fills:       ${profile.deepbook.makerFills.length}`);
  console.log(`DeepBook Taker Fills:       ${profile.deepbook.takerFills.length}`);
  console.log('='.repeat(60));
  console.log('');

  // Output full raw profile as JSON
  console.log('RAW PROFILE JSON:');
  console.log(JSON.stringify(profile, null, 2));
}

main().catch((error) => {
  console.error('Fatal error in AURA Indexer:', error);
  process.exit(1);
});
