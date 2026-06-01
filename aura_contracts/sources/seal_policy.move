module aura_contracts::seal_policy;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::object;
    use aura_contracts::access_cap::{Self, AccessCapability};
    use aura_contracts::state_vault::{Self, StateVault};

    /// Error codes
    const ENoAccess: u64 = 0;
    const ECapabilityExpired: u64 = 1;
    const EWrongVault: u64 = 2;
    const EWrongBlob: u64 = 3;
    const EInvalidScope: u64 = 4;

    /// This is the function called by Seal's Key Servers!
    /// If this function aborts, the decryption keys are denied.
    public entry fun seal_approve(
        id: vector<u8>,
        vault: &StateVault,
        cap: &AccessCapability,
        clock: &Clock,
        ctx: &TxContext
    ) {
        // 1. Ensure the capability is for this specific vault
        assert!(object::id_address(vault) == access_cap::vault_id(cap), EWrongVault);

        // 2. Verify that the requested blob `id` matches the current blob in the vault
        assert!(state_vault::blob_id(vault) == id, EWrongBlob);

        // 3. Is the person calling this function the agent named in the capability?
        assert!(tx_context::sender(ctx) == access_cap::agent(cap), ENoAccess);

        // 4. Check scope: Agent must have read (1) or both (3) scope
        let scope = access_cap::scope(cap);
        assert!(scope == 1 || scope == 3, EInvalidScope);

        // 5. Has the capability expired?
        assert!(access_cap::is_valid(cap, clock), ECapabilityExpired);
    }
