module aura_contracts::access_cap;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::transfer;
    
    // We import the StateVault so we can link capabilities to it!
    use aura_contracts::state_vault::{Self, StateVault};

    /// Error codes
    const ENotVaultOwner: u64 = 0;
    const ENotAuthorizedAgent: u64 = 1;
    const EWrongVault: u64 = 2;
    const EInvalidScope: u64 = 3;
    const ECapabilityExpired: u64 = 4;
    const ENotExpired: u64 = 5;

    /// This is the time-bound permission slip for an agent
    public struct AccessCapability has key {
        id: UID,
        vault_id: address,         // Which vault this grants access to
        agent: address,            // The agent receiving permission
        scope: u8,                 // 1=read, 2=write, 3=both
        expiry_timestamp_ms: u64,  // When it expires
        issued_at: u64,            // When it was created
    }

    /// The vault owner issues a time-bound capability to an agent.
    public entry fun issue_capability(
        vault: &StateVault,
        agent: address,
        scope: u8,
        duration_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // 1. Verify that the person trying to issue the pass actually owns the vault
        assert!(sender == state_vault::owner(vault), ENotVaultOwner);

        // 2. Calculate timestamps
        let now = clock::timestamp_ms(clock);
        
        let cap = AccessCapability {
            id: object::new(ctx),
            vault_id: object::id_address(vault),
            agent: agent,
            scope: scope,
            expiry_timestamp_ms: now + duration_ms,
            issued_at: now,
        };

        // 3. Give the soulbound pass to the agent
        transfer::transfer(cap, agent);
    }

    /// Agent updates the state using their capability
    public entry fun agent_update_state(
        cap: &AccessCapability,
        vault: &mut StateVault,
        new_blob_id: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 1. Must be the assigned agent
        assert!(tx_context::sender(ctx) == cap.agent, ENotAuthorizedAgent);
        
        // 2. Capability must match this specific vault
        assert!(object::id_address(vault) == cap.vault_id, EWrongVault);
        
        // 3. Agent must have write (2) or both (3) scope
        assert!(cap.scope == 2 || cap.scope == 3, EInvalidScope);
        
        // 4. Must not be expired
        assert!(is_valid(cap, clock), ECapabilityExpired);

        // Perform the update using the package-level access function
        state_vault::set_blob_id(vault, new_blob_id);
    }

    /// Garbage-collect expired capabilities
    public entry fun destroy_expired(cap: AccessCapability, clock: &Clock) {
        assert!(!is_valid(&cap, clock), ENotExpired);
        let AccessCapability { id, vault_id: _, agent: _, scope: _, expiry_timestamp_ms: _, issued_at: _ } = cap;
        object::delete(id);
    }

    // --- GETTERS ---
    public fun agent(cap: &AccessCapability): address {
        cap.agent
    }

    public fun vault_id(cap: &AccessCapability): address {
        cap.vault_id
    }

    public fun scope(cap: &AccessCapability): u8 {
        cap.scope
    }

    public fun is_valid(cap: &AccessCapability, clock: &Clock): bool {
        clock::timestamp_ms(clock) < cap.expiry_timestamp_ms
    }
