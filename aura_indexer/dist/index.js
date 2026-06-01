/**
 * AURA Indexer - Main Entry Point
 *
 * This is the orchestrator that runs all protocol fetchers concurrently
 * and aggregates their results into a single RawUserProfile.
 *
 * Usage:
 *   npx tsx src/index.ts <SUI_ADDRESS>
 *
 * Example:
 *   npx tsx src/index.ts 0x008e9c621f4fdb210b873aab59a1e5bf32ddb1d33ee85eb069b348c234465106
 *
 * What it does:
 *   1. Accepts a Sui address as a CLI argument.
 *   2. Runs the Cetus, Scallop, and DeepBook fetchers in parallel.
 *   3. Aggregates all raw data into a RawUserProfile object.
 *   4. Prints the result as formatted JSON to stdout.
 *
 * Future phases will:
 *   - Clean and derive a risk profile from this raw data.
 *   - Encrypt the profile using Seal.
 *   - Upload to Walrus.
 *   - Update the user's StateVault on-chain.
 */
import { fetchCetusData } from './fetchers/cetus.js';
import { fetchScallopData } from './fetchers/scallop.js';
import { fetchDeepBookData } from './fetchers/deepbook.js';
async function main() {
    // Parse CLI argument
    const userAddress = process.argv[2];
    if (!userAddress) {
        console.error('Usage: npx tsx src/index.ts <SUI_ADDRESS>');
        console.error('Example: npx tsx src/index.ts 0x008e9c621f4fdb210b873aab59a1e5bf32ddb1d33ee85eb069b348c234465106');
        process.exit(1);
    }
    // Validate address format (basic check)
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
    // Run all protocol fetchers concurrently
    const [cetusData, scallopData, deepbookData] = await Promise.all([
        fetchCetusData(userAddress),
        fetchScallopData(userAddress),
        fetchDeepBookData(userAddress),
    ]);
    // Aggregate into a single profile
    const profile = {
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
    console.log(`Cetus Swaps:          ${profile.cetus.swaps.length}`);
    console.log(`Cetus LP Positions:   ${profile.cetus.positions.length}`);
    console.log(`Scallop Obligations:  ${profile.scallop.obligations.length}`);
    console.log(`DeepBook Maker Fills: ${profile.deepbook.makerFills.length}`);
    console.log(`DeepBook Taker Fills: ${profile.deepbook.takerFills.length}`);
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
//# sourceMappingURL=index.js.map