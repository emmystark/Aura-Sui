import { useState } from 'react'

// ─── Sub-components ───────────────────────────────────────────────────────────

const SuiIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 2C8 2 4 5 4 9a4 4 0 008 0c0-4-4-7-4-7z"
      stroke="#4B9FFF" strokeWidth="1.2" fill="rgba(75,159,255,0.15)"/>
  </svg>
)

const WalrusIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke="#7C5CFC" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="6" stroke="rgba(124,92,252,0.35)" strokeWidth="1"/>
  </svg>
)

// Toggle switch
const Toggle = ({
  enabled,
  onChange,
  accentColor = '#7C5CFC',
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  accentColor?: string
}) => (
  <button
    onClick={() => onChange(!enabled)}
    className="relative inline-flex w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
    style={{ background: enabled ? accentColor : 'rgba(255,255,255,0.12)' }}
  >
    <span
      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
      style={{ left: enabled ? '24px' : '4px' }}
    />
  </button>
)

// Select dropdown (visual only)
const SelectField = ({ value }: { value: string }) => (
  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-sm text-white/80">
    {value}
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/35">
      <path d="M4 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
)

// Section card wrapper
const SettingsCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`card p-6 ${className}`}>{children}</div>
)

// Section header
const SectionHeader = ({
  icon,
  title,
  sub,
  iconColor = '#7C5CFC',
}: {
  icon: JSX.Element
  title: string
  sub: string
  iconColor?: string
}) => (
  <div className="flex items-start gap-4 mb-5">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}30` }}
    >
      <span style={{ color: iconColor }}>{icon}</span>
    </div>
    <div>
      <p className="font-semibold text-base">{title}</p>
      <p className="text-white/40 text-sm mt-0.5">{sub}</p>
    </div>
  </div>
)

// Permission row with select
const PermissionRow = ({
  icon,
  label,
  sub,
  control,
}: {
  icon: JSX.Element
  label: string
  sub: string
  control: React.ReactNode
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0">
    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center flex-shrink-0 text-[#7C5CFC]">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-white/35 text-xs mt-0.5">{sub}</p>
    </div>
    {control}
  </div>
)

// Security check row
const SecurityCheck = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2.5 py-2">
    <div className="w-5 h-5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M2.5 5.5l2 2 4-4" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <p className="text-white/65 text-sm">{label}</p>
  </div>
)

// ─── Main SettingsView ────────────────────────────────────────────────────────

export default function SettingsView() {
  const [autoExpire, setAutoExpire] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-white/40 text-sm mt-0.5">System configuration and identity layer.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" style={{ boxShadow: '0 0 8px #22C55E' }}/>
              Connected
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold">AL</div>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-2 gap-5">

        {/* ── Identity ── */}
        <SettingsCard>
          <SectionHeader
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 14c0-3 2.5-5.5 5.5-5.5S13.5 11 13.5 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
            title="Identity"
            sub={<span>You are connected via <span className="text-[#7C5CFC]">zkLogin</span>.</span> as any}
          />

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold"
                style={{ background: 'transparent', border: '2px solid #7C5CFC' }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(124,92,252,0.1)' }}
                >
                  AL
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="pb-3 border-b border-white/[0.06]">
                <p className="text-white/35 text-xs mb-1">Account</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">user@gmail.com</p>
                  <span className="flex items-center gap-1 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/25 px-2 py-0.5 rounded-full">
                    Verified
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1"/>
                      <path d="M3 5.5l2 2 3-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="pb-3 border-b border-white/[0.06]">
                <p className="text-white/35 text-xs mb-1">Sui Address</p>
                <p className="font-mono text-sm flex items-center gap-1.5">
                  0x8a3c...92f1
                  <button className="text-white/25 hover:text-white/60 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <rect x="1" y="3" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
                      <path d="M4 3V2a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H10" stroke="currentColor" strokeWidth="1.1"/>
                    </svg>
                  </button>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/35 text-xs mb-1">Status</p>
                  <p className="text-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"/>
                    Connected
                  </p>
                </div>
                <div>
                  <p className="text-white/35 text-xs mb-1">zkLogin Session</p>
                  <p className="text-sm text-[#22C55E]">Active</p>
                </div>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* ── Network ── */}
        <SettingsCard>
          <SectionHeader
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><ellipse cx="8" cy="8" rx="2.5" ry="6" stroke="currentColor" strokeWidth="1.3"/><path d="M2 8h12" stroke="currentColor" strokeWidth="1.3"/></svg>}
            title="Network"
            sub="Configure and monitor network connections."
          />

          <div className="space-y-3">
            {/* Sui Network row */}
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4B9FFF]/10 border border-[#4B9FFF]/25 flex items-center justify-center">
                  <SuiIcon size={14}/>
                </div>
                <div>
                  <p className="text-xs text-white/40">Sui Network</p>
                  <p className="text-sm text-[#4B9FFF] font-medium">Testnet</p>
                </div>
              </div>
              <SelectField value="Change Network" />
            </div>

            {/* Walrus Storage row */}
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/25 flex items-center justify-center">
                  <WalrusIcon size={14}/>
                </div>
                <div>
                  <p className="text-xs text-white/40">Walrus Storage</p>
                  <p className="text-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"/>
                    Active
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-sm text-white/80">
                View Storage
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 9L9 2M9 2H5M9 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Last sync + storage status */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-white/35 text-xs mb-1">Last Sync</p>
                <p className="text-sm font-medium">2 mins ago</p>
              </div>
              <div>
                <p className="text-white/35 text-xs mb-1">Storage Status</p>
                <p className="text-sm text-[#22C55E] font-medium">Healthy</p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* ── Default Agent Permissions ── */}
        <SettingsCard>
          <SectionHeader
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l4 2v3c0 2.5-2 4.5-4 5C6 11.5 4 9.5 4 7V4l4-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
            title="Default Agent Permissions"
            sub="Set global defaults for agent interactions."
          />

          <div>
            <PermissionRow
              icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 4v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>}
              label="Default Access Duration"
              sub="Agents get access for a limited time."
              control={<SelectField value="10 minutes" />}
            />
            <PermissionRow
              icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2l-2.5 4h2.5l-1.5 4.5 4-5H6.5l0.5-3.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>}
              label="Max Actions per Session"
              sub="Limit the number of actions per access."
              control={<SelectField value="1 action" />}
            />
            <PermissionRow
              icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l3 1.5v2.5c0 2-1.5 3.5-3 4C5 9 3.5 7.5 3.5 5.5V3l3-1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>}
              label="Auto-expire Access"
              sub="Revoke access automatically after expiry."
              control={<Toggle enabled={autoExpire} onChange={setAutoExpire} />}
            />
            <PermissionRow
              icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M2 11c0-2.2 2-4 4.5-4S11 8.8 11 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>}
              label="Auto-approve Trusted Agents"
              sub="Automatically approve agents you've marked as trusted."
              control={<Toggle enabled={autoApprove} onChange={setAutoApprove} accentColor="#22C55E" />}
            />
          </div>

          <p className="mt-4 text-white/30 text-xs flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1"/>
              <path d="M6 5.5V8M6 4.2v.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
            These defaults apply to all new access requests.
          </p>
        </SettingsCard>

        {/* ── Security + Danger Zone ── */}
        <div className="space-y-5">
          {/* Security */}
          <SettingsCard>
            <SectionHeader
              icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l4.5 2v3c0 2.8-2.2 5-4.5 5.5C5.7 12 3.5 9.8 3.5 7V4L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
              title="Security"
              sub="System security and trust guarantees."
            />
            <div>
              {[
                'All memory is encrypted before being stored on Walrus.',
                'Permissions are enforced on-chain using Move capabilities.',
                'All agent actions are time-bound and revocable.',
                'Activity is fully logged and verifiable on-chain.',
              ].map((text, i) => (
                <SecurityCheck key={i} label={text} />
              ))}
            </div>
          </SettingsCard>

          {/* Danger Zone */}
          <SettingsCard className="border-[#EF4444]/20 bg-[#EF4444]/[0.02]">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3l6 10H2L8 3z" stroke="#EF4444" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M8 7v3M8 11.5v.5" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#EF4444]">Danger Zone</p>
                <p className="text-white/40 text-sm mt-0.5">Irreversible and system-level actions.</p>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Reset Memory Vault</p>
                <p className="text-white/40 text-xs mt-0.5">This will create a new memory state object</p>
              </div>
              {showResetConfirm ? (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-2 rounded-lg border border-white/15 text-xs text-white/60 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-2 rounded-lg bg-[#EF4444] text-white text-xs font-medium hover:bg-[#DC2626] transition-colors"
                  >
                    Confirm Reset
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex-shrink-0 px-4 py-2 rounded-lg border border-[#EF4444]/40 text-[#EF4444] text-sm hover:bg-[#EF4444]/10 transition-colors"
                >
                  Reset Vault
                </button>
              )}
            </div>
          </SettingsCard>
        </div>
      </div>

      {/* Footer callout */}
      <div className="mx-8 mb-8 card px-6 py-4 flex items-center justify-between border-[#7C5CFC]/15 bg-[#7C5CFC]/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#7C5CFC]/15 border border-[#7C5CFC]/25 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2l3.5 1.5v2.5c0 2-1.5 3.5-3.5 4.5C5 9.5 3.5 8 3.5 6V3.5L7 2z"
                stroke="#7C5CFC" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[#7C5CFC] text-sm font-medium">You're in control.</p>
            <p className="text-white/40 text-xs mt-0.5">
              Aura gives you full sovereignty over your memory and how agents interact with it.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
          Learn more about Aura
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 11L11 2M11 2H6M11 2V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}