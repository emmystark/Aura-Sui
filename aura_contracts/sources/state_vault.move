module aura_contracts::state_vault;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// Error codes
    const ENotOwner: u64 = 0;

    // This is the object that will live on the blockchain
    public struct StateVault has key, store {
        id: UID,
        owner: address,
        blob_id: vector<u8>, // The pointer to Walrus!
    }

    /// Creates a new vault and makes it a shared object
    public entry fun create_vault(blob_id: vector<u8>, ctx: &mut TxContext) {
        // 1. Get the address of the person calling this function (the zkLogin user)
        let sender = tx_context::sender(ctx);

        // 2. Create the vault in memory
        let vault = StateVault {
            id: object::new(ctx),
            owner: sender,
            blob_id: blob_id,
        };

        // 3. Share the vault so agents can access it (protected by capabilities)
        transfer::share_object(vault);
    }

    /// Updates the state pointer by the manual owner
    public entry fun update_state(vault: &mut StateVault, new_blob_id: vector<u8>, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        // Security check: Must be the actual owner
        assert!(sender == vault.owner, ENotOwner);

        // Update the pointer
        vault.blob_id = new_blob_id;
    }

    /// Internal function for access_cap module to update state
    public(package) fun set_blob_id(vault: &mut StateVault, new_blob_id: vector<u8>) {
        vault.blob_id = new_blob_id;
    }

    // --- GETTERS ---
    public fun owner(vault: &StateVault): address {
        vault.owner
    }

    public fun blob_id(vault: &StateVault): vector<u8> {
        vault.blob_id
    }
