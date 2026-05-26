import { useState, useEffect } from 'react'
import { LiveActivityPanel } from './AgentExecutionView'

// ─── Types (local) ────────────────────────────────────────────────────────────

type ActivityItem = {
  icon: 'agent' | 'shield' | 'play' | 'constraint' | 'bolt' | 'check' | 'db'
  label: string
  sub?: string
  subColor?: string
  time: string
  color: string
  highlight?: boolean
}

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

// Changed item row
const ChangedItem = ({
  icon,
  label,
  sub,
  badge = 'Updated',
  badgeColor = '#22C55E',
}: {
  icon: JSX.Element
  label: string
  sub: string
  badge?: string
  badgeColor?: string
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-[#7C5CFC]">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-white/40 text-xs mt-0.5">{sub}</p>
    </div>
    <span
      className="text-xs px-2.5 py-1 rounded-md flex-shrink-0"
      style={{ color: badgeColor, background: `${badgeColor}18`, border: `1px solid ${badgeColor}30` }}
    >
      {badge}
    </span>
  </div>
)

// ─── Main MemoryUpdatedView ───────────────────────────────────────────────────

export default function MemoryUpdatedView() {
  const [countdown, setCountdown] = useState(598)
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const mins = String(Math.floor(countdown / 60)).padStart(2, '0')
  const secs = String(countdown % 60).padStart(2, '0')

  const activityItems: ActivityItem[] = [
    { icon: 'agent', label: 'External agent requested state access', time: '10:24:31 AM', color: '#7C5CFC' },
    { icon: 'shield', label: 'Access capability issued', sub: `Expires in ${mins}:${secs}`, subColor: '#22C55E', time: '10:24:33 AM', color: '#22C55E' },
    { icon: 'play', label: 'Agent started execution', sub: 'Reading your state...', subColor: '#7C5CFC', time: '10:24:34 AM', color: '#7C5CFC' },
    { icon: 'constraint', label: 'Applying constraints', sub: 'Validating rules and limits', time: '10:24:35 AM', color: 'rgba(255,255,255,0.3)' },
    { icon: 'bolt', label: 'Executing on DeepBook', sub: 'Submitting transaction', time: '10:24:36 AM', color: '#F59E0B' },
    { icon: 'check', label: 'Execution completed', sub: 'State update in progress', time: '10:24:38 AM', color: '#22C55E' },
    { icon: 'db', label: 'Memory updated', sub: 'New state committed to Walrus', subColor: '#22C55E', time: '10:24:39 AM', color: '#22C55E', highlight: true },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AURA State Interface</h1>
            <p className="text-white/40 text-sm mt-0.5">Autonomous state layer for agents on Sui.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"
                style={{ boxShadow: '0 0 8px #22C55E' }}/>
              Connected
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold">
              AL
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex gap-5">
        {/* Main content */}
        <div className="flex-1 space-y-5">

          {/* Success hero card */}
          <div className="card p-8 flex flex-col items-center text-center">
            {/* Success ring */}
            <div className="relative mb-5">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <defs>
                  <filter id="success-glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Background ring */}
                <circle cx="40" cy="40" r="34" fill="none"
                  stroke="rgba(34,197,94,0.15)" strokeWidth="2"/>
                {/* Animated success ring */}
                <circle cx="40" cy="40" r="34" fill="none"
                  stroke="#22C55E" strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#success-glow)"
                  strokeDasharray="180 40"
                  style={{ animation: 'spin 6s linear infinite', transformOrigin: '40px 40px' }}
                />
                {/* Check icon */}
                <path d="M27 40l8 8 18-16"
                  stroke="#22C55E" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  filter="url(#success-glow)"
                />
              </svg>
              {/* Sparkle dots */}
              {[
                { x: -12, y: -8, delay: '0s' },
                { x: 10, y: -16, delay: '0.3s' },
                { x: 18, y: 4, delay: '0.6s' },
              ].map((dot, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#22C55E]"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(${dot.x + 32}px, ${dot.y + 32}px)`,
                    animation: `blink 2s ${dot.delay} ease-in-out infinite`,
                    boxShadow: '0 0 4px #22C55E',
                  }}
                />
              ))}
            </div>

            <h2 className="text-3xl font-bold mb-2">
              Memory <span className="text-[#22C55E]">Updated</span>
            </h2>
            <p className="text-white/45 text-sm max-w-xs">
              Your state has been successfully updated and committed to Walrus.
            </p>

            {/* Divider accent */}
            <div className="flex items-center gap-2 mt-4 mb-6">
              <div className="w-10 h-px bg-white/10"/>
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"/>
              <div className="w-10 h-px bg-white/10"/>
            </div>

            {/* Blob ID diff card */}
            <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              {/* Version badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/30 text-xs tracking-widest uppercase">New State Commit</span>
                <span className="text-xs font-mono text-[#7C5CFC] bg-[#7C5CFC]/15 border border-[#7C5CFC]/25 px-2 py-0.5 rounded">
                  v3
                </span>
              </div>

              {/* Blob ID transition */}
              <div className="flex items-center gap-3 mb-5">
                {/* Old blob */}
                <div className="flex-1 flex items-center gap-2.5 p-3 rounded-lg border border-white/[0.07] bg-white/[0.02]">
                  <div className="w-7 h-7 rounded-md bg-[#7C5CFC]/15 border border-[#7C5CFC]/25 flex items-center justify-center">
                    <WalrusIcon size={14}/>
                  </div>
                  <div className="text-left">
                    <p className="text-white/30 text-xs">Old Blob ID</p>
                    <p className="font-mono text-sm text-white/70">0x4f...a2b</p>
                  </div>
                </div>

                {/* Arrow */}
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="flex-shrink-0 text-white/20">
                  <path d="M2 8h14M12 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {/* New blob */}
                <div className="flex-1 flex items-center gap-2.5 p-3 rounded-lg border border-[#22C55E]/25 bg-[#22C55E]/5">
                  <div className="w-7 h-7 rounded-md bg-[#22C55E]/15 border border-[#22C55E]/25 flex items-center justify-center">
                    <WalrusIcon size={14}/>
                  </div>
                  <div className="text-left">
                    <p className="text-[#22C55E]/70 text-xs">New Blob ID</p>
                    <p className="font-mono text-sm text-white">0x9c...7de</p>
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                <div>
                  <p className="text-white/30 text-xs mb-1">Committed at</p>
                  <p className="text-sm font-mono">10:24:39 AM</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs mb-1">Transaction</p>
                  <p className="text-sm font-mono text-[#4B9FFF] flex items-center gap-1">
                    0x8d3...f91e
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 9L9 2M9 2H5M9 2V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </p>
                </div>
                <div>
                  <p className="text-white/30 text-xs mb-1">Network</p>
                  <p className="text-sm flex items-center gap-1.5">
                    Sui Mainnet <SuiIcon size={12}/>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Changed */}
          <div className="card p-5">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-1">What Changed</p>

            <div className="mt-2">
              <ChangedItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h5M9 8h5M4 6l-2 2 2 2M12 6l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                label="Trade executed"
                sub="Swapped 50 SUI → 49.87 USDC on DeepBook"
              />
              <ChangedItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                }
                label="Portfolio balance"
                sub="USDC balance increased by 49.87"
              />
              <ChangedItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                }
                label="Execution log"
                sub="Trade details and result recorded"
              />
            </div>
          </div>

          {/* Storage confirmation */}
          <div className="card p-4">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Storage Confirmation</p>
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/25 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l4.5 2v4c0 2.5-2 4.5-4.5 5C5.5 12.5 3.5 10.5 3.5 8V4L8 2z"
                      stroke="#22C55E" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M5.5 8l1.8 1.8 3.2-3"
                      stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">State committed to Walrus</p>
                  <p className="text-white/40 text-xs">Encrypted and stored successfully.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 text-sm font-medium text-[#7C5CFC]">
                <WalrusIcon size={14}/>
                WALRUS
              </div>
            </div>
          </div>

          {/* Autonomous state callout */}
          <div className="card px-5 py-4 border-[#7C5CFC]/20 bg-[#7C5CFC]/5 flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0 text-[#7C5CFC]">
              <path d="M8 1l1.2 3L12 5l-2.5 2.5.7 3.5L8 9.5 5.8 11l.7-3.5L4 5l2.8-1z"
                stroke="currentColor" strokeWidth="1.1" fill="rgba(124,92,252,0.15)"/>
            </svg>
            <div>
              <p className="text-[#7C5CFC] text-sm font-medium">
                Your autonomous state is now up to date.
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                Agents will use this latest state for future interactions.
              </p>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l4.5 2v3c0 2.8-2 4.8-4.5 5.5C5.5 11.8 3.5 9.8 3.5 7V4L8 2z"
                      stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                ),
                label: 'Permissioned',
                desc: 'Access is time-bound and verifiable.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                ),
                label: 'Agent Active',
                desc: 'Execution completed successfully.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l-3 4.5h3l-1.5 5.5 4.5-6H8.5L8 2z"
                      stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'On-Chain Enforced',
                desc: 'All actions are logged and verifiable.',
              },
            ].map(({ icon, label, desc }, i) => (
              <div key={i} className="card px-4 py-3 flex items-center gap-3">
                <span className="text-white/30 flex-shrink-0">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{desc}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0"
                  style={{ boxShadow: '0 0 6px #22C55E' }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live activity */}
        <LiveActivityPanel items={activityItems} highlightIndex={6} />
      </div>
    </div>
  )
}