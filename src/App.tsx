import { useState, useEffect } from 'react'
import AgentExecutionView from './components/AgentExecutionView'
import MemoryUpdatedView from './components/MemoryUpdatedView'
import SettingsView from './components/Settingsview'
import ActivityView from './components/Activityview'

// ─── Shared Components ───────────────────────────────────────────────────────

const AuraRingLogo = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="9" fill="none" stroke="rgba(200,190,255,0.4)" strokeWidth="1"/>
    </svg>
  </div>
)

const AuraRingLarge = ({ size = 130, animating = false }: { size?: number; animating?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 130 130" style={animating ? { animation: 'glowPulse 3s ease-in-out infinite' } : {}}>
    <defs>
      <filter id="glow-large">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="arcGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
        <stop offset="50%" stopColor="rgba(220,215,255,0.7)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.95)"/>
      </linearGradient>
    </defs>
    <circle cx="65" cy="65" r="58" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
    <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
    {/* Main sweep arc */}
    <path
      d="M 65 13 A 52 52 0 1 1 23 95"
      fill="none"
      stroke="url(#arcGrad1)"
      strokeWidth="2.5"
      strokeLinecap="round"
      filter="url(#glow-large)"
      style={{ animation: 'spin 7s linear infinite', transformOrigin: '65px 65px' }}
    />
    {/* Secondary inner arc */}
    <path
      d="M 65 24 A 41 41 0 0 1 106 65"
      fill="none"
      stroke="rgba(180,160,255,0.45)"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ animation: 'spin 5s linear infinite reverse', transformOrigin: '65px 65px' }}
    />
  </svg>
)

const Sidebar = ({ active, setActive }: { active: string; setActive: (s: string) => void }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'state', label: 'State', icon: StateIcon },
    { id: 'access', label: 'Access', icon: ShieldIcon },
    { id: 'activity', label: 'Activity', icon: ActivityIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]
  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#09090F] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/[0.06]">
        <AuraRingLogo />
        <span className="text-lg font-semibold tracking-[0.18em] uppercase">AURA</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              active === id
                ? 'bg-white/[0.09] text-white border border-white/[0.1]'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
            }`}
          >
            <Icon size={18} active={active === id} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center gap-2.5 text-xs text-white/40">
          <SuiIcon size={16} />
          <span>Built on <span className="text-[#4B9FFF]">Sui</span></span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-white/40">
          <WalrusIcon size={16} />
          <span>Powered by <span className="text-[#7C5CFC]">Walrus</span></span>
        </div>
      </div>
    </aside>
  )
}

// ─── Icon Components ──────────────────────────────────────────────────────────

const HomeIcon = ({ size = 18, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M2 7.5L9 2l7 5.5V16H11.5v-4h-5v4H2z" stroke={active ? 'white' : 'currentColor'} strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
)
const StateIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)
const ShieldIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M9 2l6 2.5v5C15 13 12.5 15.5 9 17 5.5 15.5 3 13 3 9.5v-5L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
)
const ActivityIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M2 9h3l2-5 3 9 2-7 2 3h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const SettingsIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
const SuiIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 2C8 2 4 5 4 9a4 4 0 008 0c0-4-4-7-4-7z" stroke="#4B9FFF" strokeWidth="1.2" fill="rgba(75,159,255,0.15)"/>
  </svg>
)
const WalrusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke="#7C5CFC" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="6" stroke="rgba(124,92,252,0.35)" strokeWidth="1"/>
  </svg>
)

// ─── Overview View ────────────────────────────────────────────────────────────

const OverviewView = () => {
  const [countdown, setCountdown] = useState(582) // seconds
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const activityItems = [
    { icon: 'agent', label: 'External agent requested state access', time: '10:24:31 AM', color: '#7C5CFC' },
    { icon: 'shield', label: 'Access capability issued', sub: `Expires in ${timeStr}`, subColor: '#22C55E', time: '10:24:33 AM', color: '#22C55E' },
    { icon: 'db', label: 'State retrieved from Walrus', sub: 'Pointer: 0x4f...a2b', time: '10:24:35 AM', color: '#7C5CFC' },
    { icon: 'bolt', label: 'Execution completed', sub: 'within state constraints', time: '10:24:37 AM', color: '#F59E0B' },
    { icon: 'check', label: 'State updated via AURA', sub: 'New version: v3', time: '10:24:39 AM', color: '#22C55E' },
  ]

  const activityIcons: Record<string, JSX.Element> = {
    agent: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="white" strokeWidth="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l5 2v4c0 3-2 5.5-5 6.5C6 13.5 4 11 4 8V4l5-2z" stroke="white" strokeWidth="1.3"/><path d="M6.5 9l1.8 1.8 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    db: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><ellipse cx="9" cy="5" rx="6" ry="2.5" stroke="white" strokeWidth="1.3"/><path d="M3 5v4c0 1.4 2.7 2.5 6 2.5S15 10.4 15 9V5" stroke="white" strokeWidth="1.3"/><path d="M3 9v4c0 1.4 2.7 2.5 6 2.5S15 13.4 15 13V9" stroke="white" strokeWidth="1.3"/></svg>,
    bolt: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10 3l-4 6h4l-2 6 5-7h-4l1-5z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    check: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.3"/><path d="M6 9l2.2 2.2 3.8-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  }

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
              <span className="status-dot"/>
              Connected
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold">AL</div>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-[1fr_340px] gap-5">
        {/* Left column */}
        <div className="space-y-5">

          {/* State Vault */}
          <div className="card transition-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base">State Vault</h2>
              <span className="flex items-center gap-1.5 text-xs text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"/>
                Active
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <AuraRingLarge size={100} />
              </div>
              <div className="flex-1">
                <p className="text-white/50 text-sm leading-relaxed">
                  Your encrypted state is securely stored<br/>on Walrus and anchored on Sui.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/35 text-xs mb-1">State Pointer (Walrus)</p>
                    <p className="font-mono text-sm flex items-center gap-1.5">
                      0x4f...a2b
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 3V2a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1H11" stroke="currentColor" strokeWidth="1.2"/></svg>
                      </button>
                    </p>
                  </div>
                  <div>
                    <p className="text-white/35 text-xs mb-1">Last Updated</p>
                    <p className="text-sm">2m ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-6 text-white/40 text-xs">
              <span className="flex items-center gap-2">
                <SuiIcon size={14}/> Anchored on Sui
              </span>
              <span className="w-px h-4 bg-white/10"/>
              <span className="flex items-center gap-2">
                <WalrusIcon size={14}/> Stored on Walrus
              </span>
            </div>
          </div>

          {/* Auto-Derived State */}
          <div className="card transition-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-base">Auto-Derived State</h2>
              <span className="flex items-center gap-1.5 text-xs text-[#7C5CFC] bg-[#7C5CFC]/10 px-2.5 py-1 rounded-full border border-[#7C5CFC]/20">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1 2.5L10 4l-2 2 .5 3L6 7.5 3.5 9l.5-3-2-2 3-.5z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                Generated from on-chain activity
              </span>
            </div>
            <p className="text-white/40 text-sm mb-5">Based on your wallet behavior and protocol interactions.</p>

            <div className="space-y-4">
              {[
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l5 2.5v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6v-4L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
                  label: 'Risk Profile',
                  value: <span className="text-[#F59E0B] flex items-center gap-1.5">Medium <span className="w-2 h-2 rounded-full bg-[#F59E0B]"/></span>
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 10l4-6 3 4 2-3 3 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  label: 'Max Slippage',
                  value: '0.50%'
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6h12M2 10h12M6 2v12M10 2v12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
                  label: 'Preferred Protocols',
                  value: (
                    <span className="flex items-center gap-2">
                      <span className="flex gap-1">
                        {['D','S','N'].map((l,i) => (
                          <span key={i} className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-xs flex items-center justify-center font-semibold">{l}</span>
                        ))}
                      </span>
                      <span className="text-white/60 text-xs">DeepBook, Scallop, Navi</span>
                    </span>
                  )
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 8h6M5 5h3M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
                  label: 'Behavior Signals',
                  value: <span className="text-white/60 text-xs text-right">Stablecoin leaning · Medium frequency<br/>Conservative slippage</span>
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
                  label: 'Constraints',
                  value: (
                    <div className="text-white/55 text-xs text-right leading-relaxed">
                      <div>• Avoid high volatility assets</div>
                      <div>• Prefer stablecoin pairs</div>
                      <div>• Only audited protocols</div>
                    </div>
                  )
                },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <span className="flex items-center gap-2.5 text-white/60 text-sm">
                    <span className="text-white/30">{row.icon}</span>
                    {row.label}
                  </span>
                  <span className="text-sm">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm font-medium hover:bg-white/5 transition-all">
                Review & Refine
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-[#7C5CFC] text-sm font-medium hover:bg-[#6B4EE0] transition-all flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.3"/>
                  <path d="M5.5 8l1.8 1.8 3.2-3.2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Commit State
              </button>
            </div>

            <p className="mt-3 text-white/30 text-xs flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="4" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.1"/></svg>
              You can refine or commit. Agents can only access after permission is granted.
            </p>
          </div>

          {/* Bottom feature bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: ShieldIcon, label: 'Permissioned', desc: 'Access is time-bound and verifiable.', color: '#7C5CFC' },
              { icon: () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3"/></svg>, label: 'Agent Ready', desc: 'Your state is ready for autonomous agents.', color: '#22C55E' },
              { icon: () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3l-3 5h3l-2 7 5-7H9l0-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>, label: 'On-Chain Enforced', desc: 'All actions are logged and verifiable.', color: '#F59E0B' },
            ].map(({ icon: Icon, label, desc, color }, i) => (
              <div key={i} className="card p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 mt-0.5" style={{ color }}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: State Activity */}
        <div className="card p-5 flex flex-col h-fit">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-base">State Activity</h2>
            <span className="flex items-center gap-1.5 text-xs text-[#22C55E]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="6" r="2" fill="currentColor" style={{ animation: 'blink 1.5s ease-in-out infinite' }}/></svg>
              Live
            </span>
          </div>
          <p className="text-white/35 text-xs mb-5">Real-time updates of agent interactions.</p>

          <div className="relative space-y-0">
            {activityItems.map((item, i) => (
              <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
                {/* Timeline line */}
                {i < activityItems.length - 1 && (
                  <div className="absolute left-[18px] top-[36px] bottom-0 w-px bg-white/[0.07]"/>
                )}
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center relative z-10"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                >
                  {activityIcons[item.icon]}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-snug">{item.label}</p>
                    <span className="text-white/30 text-xs flex-shrink-0 font-mono">{item.time}</span>
                  </div>
                  {item.sub && (
                    <p className="text-xs mt-0.5" style={{ color: item.subColor || 'rgba(255,255,255,0.4)' }}>
                      {item.sub}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-sm text-white/40 hover:text-white/70 transition-colors w-full">
            View full activity
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Initializing View ────────────────────────────────────────────────────────

const InitializingView = () => {
  const steps = [
    { icon: 'check', label: 'Authenticated via zkLogin', sub: 'Identity verified securely', status: 'done' },
    { icon: 'ring', label: 'Creating your memory vault', sub: 'Deploying vault on Sui', status: 'progress' },
    { icon: 'lock', label: 'Storing state on Walrus', sub: 'Encrypting and storing your state', status: 'pending' },
    { icon: 'derive', label: 'Deriving state from on-chain activity', sub: 'Analyzing transactions and interactions', status: 'pending' },
  ]

  const statusColors: Record<string, string> = {
    done: '#22C55E',
    progress: '#7C5CFC',
    pending: 'rgba(255,255,255,0.25)',
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative">
      {/* Status */}
      <div className="absolute top-6 right-8 flex items-center gap-2 text-sm text-[#22C55E]">
        <span className="status-dot"/>
        Initializing
      </div>

      {/* Ring */}
      <div className="mb-6">
        <AuraRingLarge size={140} animating />
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs text-white/60 mb-6">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1l1.2 2.8L10 5 7.8 7l.5 3L6 8.5 3.7 10l.5-3L2 5l2.8-1.2z" stroke="currentColor" strokeWidth="1"/>
        </svg>
        INITIALIZING YOUR AURA VAULT
      </div>

      <h2 className="text-4xl font-bold text-center mb-3">
        Deriving your <span className="text-[#7C5CFC]">autonomous</span> state...
      </h2>
      <p className="text-white/45 text-center text-base max-w-md leading-relaxed mb-10">
        AURA is creating your secure memory vault and<br/>analyzing your on-chain activity to generate state.
      </p>

      {/* Steps */}
      <div className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-5 py-4 ${i < steps.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
          >
            {/* Step icon */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                border: `2px solid ${statusColors[step.status]}`,
                background: step.status === 'done' ? `${statusColors[step.status]}20` : 'transparent'
              }}
            >
              {step.status === 'done' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8l3.2 3.2 5.6-5.6" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {step.status === 'progress' && (
                <div className="w-3 h-3 rounded-full border-2 border-[#7C5CFC] border-t-transparent" style={{ animation: 'spin 1s linear infinite' }}/>
              )}
              {step.status === 'pending' && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="5" width="10" height="8" rx="1.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
                  <path d="M4 5V4a3 3 0 016 0v1" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-white/40' : 'text-white'}`}>
                {step.label}
              </p>
              <p className="text-xs text-white/30 mt-0.5">{step.sub}</p>
            </div>

            {/* Status badge */}
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                color: statusColors[step.status],
                background: `${statusColors[step.status]}15`,
              }}
            >
              {step.status === 'done' ? 'Completed' : step.status === 'progress' ? 'In progress' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-white/30 text-sm flex items-start gap-2 text-center max-w-md">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
          <rect x="2" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M5 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.1"/>
        </svg>
        This may take a few moments. You only need to do this once.<br/>You'll be redirected to your dashboard automatically.
      </p>
    </div>
  )
}

// ─── Login / Auth View ────────────────────────────────────────────────────────

const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }))
  )

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden min-h-screen">
      {/* Back */}
      <div className="absolute top-6 right-8 text-sm text-white/40 flex items-center gap-1.5 cursor-pointer hover:text-white/70 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4l-5 4 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#7C5CFC]/40"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          />
        ))}
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none opacity-25">
        <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full">
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx="200" cy="150" r={60 + i * 30} fill="none" stroke="#7C5CFC" strokeWidth="0.8" opacity={0.5 - i * 0.07}/>
          ))}
        </svg>
      </div>

      {/* Ring */}
      <div className="mb-8 relative">
        <AuraRingLarge size={160} animating />
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)' }}/>
      </div>

      {/* Headline */}
      <h1 className="text-5xl font-bold text-center leading-[1.1] mb-4 max-w-xs">
        Access your<br/>
        <span className="text-[#7C5CFC]">AURA</span> memory vault
      </h1>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-px bg-white/20"/>
        <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"/>
        <div className="w-8 h-px bg-white/20"/>
      </div>

      {/* Subtitle */}
      <p className="text-white/45 text-center text-base leading-relaxed mb-4 max-w-xs">
        No wallet setup required.<br/>
        Your secure, on-chain memory vault is<br/>
        created instantly via <span className="text-[#7C5CFC]">zkLogin</span>.
      </p>

      {/* Identity tagline */}
      <div className="flex items-center gap-2 text-sm mb-8 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1l1.4 3L12 4.5l-2.5 2.4.6 3.3L7 8.6l-3.1 1.6.6-3.3L2 4.5l3.6-.5z" stroke="currentColor" strokeWidth="1" fill="rgba(255,255,255,0.1)"/>
        </svg>
        Your <span className="text-[#7C5CFC] font-medium">identity</span> becomes your{' '}
        <span className="text-[#4B9FFF] font-medium">access layer.</span>
      </div>

      {/* Auth section */}
      <div className="w-full max-w-xs">
        <p className="text-center text-xs tracking-widest text-white/30 mb-3 uppercase">Authenticate with zkLogin</p>
        <button
          onClick={onLogin}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/15 bg-[#111118] hover:bg-white/[0.07] transition-all duration-200 hover:border-white/25 group"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <div className="text-left">
            <p className="font-semibold text-sm">Continue with Google</p>
            <p className="text-white/40 text-xs">via zkLogin</p>
          </div>
        </button>

        {/* Footer trust */}
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <ShieldIcon size={12}/>
            zkLogin authentication
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20"/>
          <span>On-chain vault creation</span>
        </div>
      </div>
    </div>
  )
}

// ─── Placeholder views for other nav ─────────────────────────────────────────

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col">
    <div className="px-8 pt-7 pb-5 border-b border-white/[0.06]">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-white/35 text-sm mt-0.5">Coming soon in the full implementation.</p>
    </div>
    <div className="flex-1 flex items-center justify-center opacity-20">
      <AuraRingLarge size={100} />
    </div>
  </div>
)

// ─── Root App ─────────────────────────────────────────────────────────────────

type AppView = 'login' | 'init' | 'dashboard'

export default function App() {
  const [appView, setAppView] = useState<AppView>('login')
  const [activeNav, setActiveNav] = useState('overview')

  // Auto-advance from init to dashboard
  useEffect(() => {
    if (appView === 'init') {
      const t = setTimeout(() => setAppView('dashboard'), 5000)
      return () => clearTimeout(t)
    }
  }, [appView])

  const handleLogin = () => setAppView('init')

  // Full-screen views (no sidebar)
  if (appView === 'login') {
    return (
      <div className="min-h-screen bg-[#09090F] text-white font-display flex">
        <LoginView onLogin={handleLogin} />
      </div>
    )
  }

  if (appView === 'init') {
    return (
      <div className="min-h-screen bg-[#09090F] text-white font-display flex">
        <Sidebar active={activeNav} setActive={setActiveNav} />
        <InitializingView />
      </div>
    )
  }

  const views: Record<string, JSX.Element> = {
    overview: <OverviewView />,
    state: <AgentExecutionView />,   // was PlaceholderView "State Management"
    access: <MemoryUpdatedView />,
    activity: <ActivityView />,
    settings: <SettingsView />,
  }

  return (
    <div className="min-h-screen bg-[#09090F] text-white font-display flex">
      <Sidebar active={activeNav} setActive={setActiveNav} />
      {views[activeNav] || <OverviewView />}
    </div>
  )
}
