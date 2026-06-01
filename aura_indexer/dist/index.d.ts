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
export {};
//# sourceMappingURL=index.d.ts.map