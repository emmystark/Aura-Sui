import { useState, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityItem = {
  icon: 'agent' | 'shield' | 'play' | 'constraint' | 'bolt' | 'check' | 'db'
  label: string
  sub?: string
  subColor?: string
  time: string
  color: string
  highlight?: boolean
}

// ─── Shared icon helpers (inline to keep file self-contained) ─────────────────

// ─── Activity Panel (shared right column) ────────────────────────────────────

const activityIconMap: Record<ActivityItem['icon'], JSX.Element> = {
  agent: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="2.5" stroke="white" strokeWidth="1.2"/>
      <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V4l5-2z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M5.5 8l1.8 1.8 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  play: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2"/>
      <path d="M6.5 8l1.8 1.8 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  constraint: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" strokeDasharray="2 2"/>
      <circle cx="8" cy="8" r="2" fill="white" fillOpacity="0.5"/>
    </svg>
  ),
  bolt: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 3l-3.5 5h3.5l-1.5 5 4.5-6H8.5L9 3z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2"/>
      <path d="M5.5 8l1.8 1.8 3.2-3.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  db: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4.5" rx="5" ry="2" stroke="white" strokeWidth="1.2"/>
      <path d="M3 4.5v3c0 1.1 2.2 2 5 2s5-.9 5-2v-3" stroke="white" strokeWidth="1.2"/>
      <path d="M3 7.5v3c0 1.1 2.2 2 5 2s5-.9 5-2v-3" stroke="white" strokeWidth="1.2"/>
    </svg>
  ),
}

export const LiveActivityPanel = ({
  items,
  highlightIndex,
}: {
  items: ActivityItem[]
  highlightIndex?: number
}) => (
  <div className="card p-5 flex flex-col h-fit w-[340px] flex-shrink-0">
    <div className="flex items-center justify-between mb-1">
      <h2 className="font-semibold text-base">Live Activity</h2>
      <span className="flex items-center gap-1.5 text-xs text-[#22C55E]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="6" cy="6" r="2" fill="currentColor"
            style={{ animation: 'blink 1.5s ease-in-out infinite' }}/>
        </svg>
        Live
      </span>
    </div>
    <p className="text-white/35 text-xs mb-5">Real-time updates of agent interactions.</p>

    <div className="space-y-0">
      {items.map((item, i) => {
        const isHighlighted = highlightIndex === i
        return (
          <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {i < items.length - 1 && (
              <div className="absolute left-[17px] top-[36px] bottom-0 w-px bg-white/[0.07]"/>
            )}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center relative z-10 transition-all"
              style={{
                background: isHighlighted ? `${item.color}30` : `${item.color}15`,
                border: `1px solid ${item.color}${isHighlighted ? '60' : '30'}`,
              }}
            >
              {activityIconMap[item.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm leading-snug ${isHighlighted ? 'text-white' : 'text-white/80'}`}>
                  {item.label}
                </p>
                <span className="text-white/30 text-xs flex-shrink-0 font-mono">{item.time}</span>
              </div>
              {item.sub && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: item.subColor || 'rgba(255,255,255,0.4)' }}
                >
                  {item.sub}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>

    <button className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-sm text-white/40 hover:text-white/70 transition-colors w-full">
      View full activity
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
)

// ─── Execution Step Row ───────────────────────────────────────────────────────

type StepStatus = 'done' | 'active' | 'pending'

const ExecutionStep = ({
  label,
  sub,
  time,
  status,
  icon,
  isLast = false,
}: {
  label: string
  sub: string
  time: string
  status: StepStatus
  icon: JSX.Element
  isLast?: boolean
}) => {
  const dotColors: Record<StepStatus, string> = {
    done: '#22C55E',
    active: '#7C5CFC',
    pending: 'rgba(255,255,255,0.15)',
  }

  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      {!isLast && (
        <div
          className="absolute left-[17px] top-[36px] bottom-0 w-px"
          style={{
            background: status === 'done'
              ? 'rgba(34,197,94,0.25)'
              : 'rgba(255,255,255,0.06)',
          }}
        />
      )}

      {/* Step dot/icon */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center relative z-10"
        style={{
          border: `2px solid ${dotColors[status]}`,
          background: status !== 'pending' ? `${dotColors[status]}15` : 'transparent',
        }}
      >
        {status === 'done' ? (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M3.5 7.5l2.8 2.8 5-5" stroke="#22C55E" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : status === 'active' ? (
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-[#7C5CFC]"
            style={{ animation: 'spin 1s linear infinite' }}
          />
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>{icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-5 last:pb-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium ${status === 'pending' ? 'text-white/35' : 'text-white'}`}>
            {label}
          </p>
          <span className="text-white/30 text-xs font-mono flex-shrink-0">{time}</span>
        </div>
        <p className={`text-xs mt-0.5 ${status === 'pending' ? 'text-white/20' : 'text-white/45'}`}>
          {sub}
        </p>
      </div>
    </div>
  )
}

// ─── State Badge Row ──────────────────────────────────────────────────────────

const StateBadge = ({
  label,
  value,
  valueClass = '',
}: {
  label: string
  value: React.ReactNode
  valueClass?: string
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-white/35 text-xs">{label}</p>
    <div className={`text-sm font-medium ${valueClass}`}>{value}</div>
  </div>
)

// ─── Main AgentExecutionView ──────────────────────────────────────────────────

export default function AgentExecutionView() {
  const [seconds, setSeconds] = useState(598) // 09:58

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  const steps: {
    label: string
    sub: string
    time: string
    status: StepStatus
    icon: JSX.Element
  }[] = [
    {
      label: 'Access granted',
      sub: 'Capability verified on-chain',
      time: '10:24:33 AM',
      status: 'done',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      label: 'Reading memory state',
      sub: 'Fetching encrypted state from Walrus',
      time: '10:24:34 AM',
      status: 'done',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><ellipse cx="7" cy="4" rx="4" ry="1.8" stroke="currentColor" strokeWidth="1.2"/><path d="M3 4v3c0 1 1.8 1.8 4 1.8S11 8 11 7V4" stroke="currentColor" strokeWidth="1.2"/></svg>,
    },
    {
      label: 'Applying constraints',
      sub: 'Validating against your risk profile and rules',
      time: '10:24:35 AM',
      status: 'active',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1.5"/></svg>,
    },
    {
      label: 'Executing action',
      sub: 'Submitting transaction to DeepBook',
      time: '10:24:36 AM',
      status: 'pending',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.5l-3 4.5h3l-1.5 4.5 4-5.5H7l0.5-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
    },
    {
      label: 'Transaction complete',
      sub: 'Logging result and updating state',
      time: '10:24:38 AM',
      status: 'pending',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
  ]

  const activityItems: ActivityItem[] = [
    { icon: 'agent', label: 'External agent requested state access', time: '10:24:31 AM', color: '#7C5CFC' },
    { icon: 'shield', label: 'Access capability issued', sub: `Expires in ${mins}:${secs}`, subColor: '#22C55E', time: '10:24:33 AM', color: '#22C55E' },
    { icon: 'play', label: 'Agent started execution', sub: 'Reading your state...', subColor: '#7C5CFC', time: '10:24:34 AM', color: '#7C5CFC', highlight: true },
    { icon: 'constraint', label: 'Applying constraints', sub: 'Validating rules and limits', time: '10:24:35 AM', color: 'rgba(255,255,255,0.3)' },
    { icon: 'bolt', label: 'Executing on DeepBook', sub: 'Submitting transaction', time: '10:24:36 AM', color: '#F59E0B' },
    { icon: 'check', label: 'Execution completed', sub: 'State update in progress', time: '10:24:38 AM', color: '#22C55E' },
    { icon: 'db', label: 'State update pending', sub: 'Writing new state to Walrus', time: '10:24:39 AM', color: '#7C5CFC' },
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
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" style={{ boxShadow: '0 0 8px #22C55E' }}/>
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

          {/* Agent Execution card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-lg">Agent Execution</h2>
              <span className="flex items-center gap-1.5 text-xs text-[#7C5CFC] border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-2.5 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.1"/>
                  <circle cx="5" cy="5" r="1.5" fill="currentColor"
                    style={{ animation: 'blink 1.5s ease-in-out infinite' }}/>
                </svg>
                Live
              </span>
            </div>
            <p className="text-white/40 text-sm mb-6">DeepBook Executor is actively using your state.</p>

            {/* Agent identity + timer */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] mb-6">
              <div className="flex items-center gap-4">
                {/* Bot avatar */}
                <div className="w-12 h-12 rounded-xl border border-[#7C5CFC]/40 bg-[#7C5CFC]/10 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="3" y="8" width="16" height="11" rx="3" stroke="#7C5CFC" strokeWidth="1.4"/>
                    <circle cx="8" cy="13" r="1.5" fill="#7C5CFC"/>
                    <circle cx="14" cy="13" r="1.5" fill="#7C5CFC"/>
                    <path d="M11 3v5" stroke="#7C5CFC" strokeWidth="1.4" strokeLinecap="round"/>
                    <circle cx="11" cy="3" r="1.2" fill="#7C5CFC"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-base">DeepBook Executor</p>
                  <p className="text-white/40 text-xs flex items-center gap-1.5 mt-0.5">
                    Agent ID: 0x7a3...9f21
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1"/>
                      <path d="M6 4v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </p>
                  <p className="text-[#22C55E] text-xs flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"/>
                    Active
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="text-right">
                <p className="text-white/35 text-xs mb-2">Access expires in</p>
                <div className="flex items-end gap-2">
                  <div className="text-center">
                    <span
                      className="text-4xl font-bold tabular-nums"
                      style={{ color: seconds < 120 ? '#EF4444' : '#7C5CFC', fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {mins}
                    </span>
                    <p className="text-white/30 text-xs mt-0.5">min</p>
                  </div>
                  <span className="text-2xl font-bold text-white/30 mb-4">:</span>
                  <div className="text-center">
                    <span
                      className="text-4xl font-bold tabular-nums"
                      style={{ color: seconds < 120 ? '#EF4444' : '#7C5CFC', fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {secs}
                    </span>
                    <p className="text-white/30 text-xs mt-0.5">sec</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution steps */}
            <div className="mb-6">
              <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Execution Steps</p>
              <div className="space-y-0">
                {steps.map((step, i) => (
                  <ExecutionStep key={i} {...step} isLast={i === steps.length - 1} />
                ))}
              </div>
            </div>

            {/* State being used */}
            <div>
              <p className="text-white/30 text-xs tracking-widest uppercase mb-3">State Being Used</p>
              <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <StateBadge
                  label="Risk Level"
                  value="Medium"
                  valueClass="text-[#F59E0B]"
                />
                <StateBadge
                  label="Max Slippage"
                  value="0.50%"
                />
                <StateBadge
                  label="Preferred Protocols"
                  value={
                    <div className="flex items-center gap-1.5">
                      {['D','S','N'].map((l, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-xs flex items-center justify-center font-semibold"
                        >
                          {l}
                        </span>
                      ))}
                      <span className="text-white/50 text-xs">+2</span>
                    </div>
                  }
                />
                <StateBadge label="Updated" value="2m ago" />
              </div>
            </div>

            {/* Footer note */}
            <p className="mt-4 text-white/30 text-xs flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="4" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
                <path d="M4 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1"/>
              </svg>
              All actions are encrypted and enforced on-chain via Move capabilities.
            </p>
          </div>

          {/* Bottom status bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Permissioned', desc: 'Access is time-bound and verifiable.', dot: true },
              { label: 'Agent Active', desc: 'Execution in progress within constraints.', dot: true },
              { label: 'On-Chain Enforced', desc: 'All actions are logged and verifiable.', dot: true },
            ].map(({ label, desc, dot }, i) => (
              <div key={i} className="card px-4 py-3 flex items-center gap-3">
                {i === 0 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/30 flex-shrink-0">
                    <path d="M8 2l5 2v4c0 3-2.5 5-5 5.5C5.5 13 3 11 3 8V4l5-2z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                )}
                {i === 1 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/30 flex-shrink-0">
                    <rect x="3" y="5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                )}
                {i === 2 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/30 flex-shrink-0">
                    <path d="M8 2l-3 4.5h3l-1.5 5.5 4.5-6H8.5L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{desc}</p>
                </div>
                {dot && <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" style={{ boxShadow: '0 0 6px #22C55E' }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Right: live activity */}
        <LiveActivityPanel items={activityItems} highlightIndex={2} />
      </div>
    </div>
  )
}