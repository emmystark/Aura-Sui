import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'execution' | 'memory' | 'capability' | 'agent' | 'state' | 'revoked'

type ActivityEvent = {
  id: string
  type: EventType
  label: string
  agent: string
  badge?: string
  badgeColor?: string
  badgeText?: string
  time: string
  group: string
  sub?: string
  detail?: EventDetail
}

type EventDetail = {
  title: string
  agent: string
  status: 'Success' | 'Failed' | 'Pending'
  summary: string
  time: string
  transaction?: string
  network?: string
  action?: string
  input?: string
  output?: string
  slippage?: string
  slippageNote?: string
  statusText?: string
  constraintsUsed?: string
  prevBlob?: string
  newBlob?: string
  storage?: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const iconMap: Record<EventType, { el: JSX.Element; color: string }> = {
  execution: {
    color: '#7C5CFC',
    el: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l-3 5h3l-1.5 5 4.5-6H8L8 2z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
  memory: {
    color: '#22C55E',
    el: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="4.5" rx="5" ry="1.8" stroke="white" strokeWidth="1.2"/><path d="M3 4.5v3c0 1 2.2 1.8 5 1.8s5-.8 5-1.8v-3" stroke="white" strokeWidth="1.2"/><path d="M3 7.5v3c0 1 2.2 1.8 5 1.8s5-.8 5-1.8v-3" stroke="white" strokeWidth="1.2"/></svg>,
  },
  capability: {
    color: '#22C55E',
    el: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l4 2v3c0 2.5-2 4.5-4 5C6 11.5 4 9.5 4 7V4l4-2z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  agent: {
    color: '#7C5CFC',
    el: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.5" stroke="white" strokeWidth="1.2"/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  state: {
    color: '#7C5CFC',
    el: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.2"/><circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1" strokeOpacity="0.4"/></svg>,
  },
  revoked: {
    color: '#EF4444',
    el: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l4 2v3c0 2.5-2 4.5-4 5C6 11.5 4 9.5 4 7V4l4-2z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 6.5l3 3M9.5 6.5l-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
}

const SuiIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 2C8 2 4 5 4 9a4 4 0 008 0c0-4-4-7-4-7z" stroke="#4B9FFF" strokeWidth="1.2" fill="rgba(75,159,255,0.15)"/>
  </svg>
)

const WalrusIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke="#7C5CFC" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="6" stroke="rgba(124,92,252,0.35)" strokeWidth="1"/>
  </svg>
)

// ─── Event Icon Badge ─────────────────────────────────────────────────────────

const EventIcon = ({ type, size = 36 }: { type: EventType; size?: number }) => {
  const { el, color } = iconMap[type]
  return (
    <div
      className="flex-shrink-0 rounded-xl flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: `${color}18`,
        border: `1px solid ${color}35`,
      }}
    >
      {el}
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

const DetailPanel = ({
  detail,
  type,
  onClose,
}: {
  detail: EventDetail
  type: EventType
  onClose: () => void
}) => {
  const {  } = iconMap[type]
  const statusColor = detail.status === 'Success' ? '#22C55E' : detail.status === 'Failed' ? '#EF4444' : '#F59E0B'

  return (
    <div className="w-[320px] flex-shrink-0 border-l border-white/[0.06] bg-[#0C0C13] overflow-y-auto">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <EventIcon type={type} size={40} />
            <div>
              <p className="font-semibold text-sm">{detail.title}</p>
              <p className="text-white/40 text-xs mt-0.5">{detail.agent}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors mt-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="mt-3">
          <span
            className="text-xs px-2.5 py-1 rounded-md font-medium"
            style={{ color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30` }}
          >
            {detail.status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary */}
        <div>
          <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">Summary</p>
          <p className="text-white/70 text-sm leading-relaxed">{detail.summary}</p>
        </div>

        {/* Meta */}
        <div className="space-y-3 border-t border-white/[0.06] pt-4">
          <DetailRow label="Time" value={detail.time} />
          {detail.transaction && (
            <DetailRow
              label="Transaction"
              value={
                <span className="flex items-center gap-1 text-[#4B9FFF]">
                  {detail.transaction}
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 9L9 2M9 2H5M9 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
              }
            />
          )}
          {detail.network && (
            <DetailRow
              label="Network"
              value={
                <span className="flex items-center gap-1.5">
                  {detail.network} <SuiIcon size={12}/>
                </span>
              }
            />
          )}
        </div>

        {/* Execution details */}
        {detail.action && (
          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            <p className="text-white/30 text-xs font-medium uppercase tracking-wider">Details</p>
            <DetailRow label="Action" value={detail.action} valueClass="font-medium" />
            {detail.input && <DetailRow label="Input" value={detail.input} />}
            {detail.output && <DetailRow label="Output" value={detail.output} valueClass="text-[#22C55E]" />}
            {detail.slippage && (
              <DetailRow
                label="Slippage"
                value={
                  <span>
                    {detail.slippage}{' '}
                    {detail.slippageNote && (
                      <span className="text-[#22C55E] text-xs">{detail.slippageNote}</span>
                    )}
                  </span>
                }
              />
            )}
            {detail.statusText && (
              <DetailRow
                label="Status"
                value={
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"/>
                    {detail.statusText}
                  </span>
                }
              />
            )}
            {detail.constraintsUsed && (
              <div className="flex items-start justify-between gap-3">
                <span className="text-white/35 text-xs">Constraints Used</span>
                <span className="text-xs text-right leading-relaxed whitespace-pre-line">{detail.constraintsUsed}</span>
              </div>
            )}
          </div>
        )}

        {/* Linked state */}
        {(detail.prevBlob || detail.newBlob) && (
          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            <p className="text-white/30 text-xs font-medium uppercase tracking-wider">Linked State</p>
            {detail.prevBlob && (
              <DetailRow
                label="Previous Blob"
                value={
                  <span className="flex items-center gap-1 text-[#4B9FFF]">
                    {detail.prevBlob}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 9L9 2M9 2H5M9 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </span>
                }
              />
            )}
            {detail.newBlob && (
              <DetailRow
                label="New Blob"
                value={
                  <span className="flex items-center gap-1 text-[#4B9FFF]">
                    {detail.newBlob}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 9L9 2M9 2H5M9 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </span>
                }
              />
            )}
            {detail.storage && (
              <DetailRow
                label="Storage"
                value={
                  <span className="flex items-center gap-1.5 text-[#7C5CFC]">
                    {detail.storage} <WalrusIcon size={12}/>
                  </span>
                }
              />
            )}
          </div>
        )}

        {/* Verified banner */}
        <div className="rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/5 p-3.5 flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2l4 2v3c0 2.5-2 4.5-4 5C6 11.5 4 9.5 4 7V4l4-2z"
                stroke="#22C55E" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M6 7l1.5 1.5 3-3" stroke="#22C55E" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[#22C55E] text-xs font-medium">Verified on-chain</p>
            <p className="text-white/35 text-xs mt-0.5 leading-relaxed">
              All actions are encrypted and verifiable via Move capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const DetailRow = ({
  label,
  value,
  valueClass = '',
}: {
  label: string
  value: React.ReactNode
  valueClass?: string
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-white/35 text-xs flex-shrink-0">{label}</span>
    <span className={`text-xs text-right ${valueClass || 'text-white/80'}`}>{value}</span>
  </div>
)

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const FilterSelect = ({
  icon,
  value,
}: {
  icon?: JSX.Element
  value: string
  options: string[]
}) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.1] bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-colors text-sm text-white/70">
    {icon && <span className="text-white/40">{icon}</span>}
    {value}
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/30 ml-1">
      <path d="M4 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

// ─── Main ActivityView ────────────────────────────────────────────────────────

const events: ActivityEvent[] = [
  {
    id: '1', type: 'execution', label: 'Execution completed', agent: 'DeepBook Executor',
    badge: 'Success', badgeColor: '#22C55E', time: '10:24:38 AM', group: 'Today – May 20, 2025',
    detail: {
      title: 'Execution completed', agent: 'DeepBook Executor', status: 'Success',
      summary: 'The agent executed an action on DeepBook using your state within the approved constraints.',
      time: 'May 20, 2025 10:24:38 AM', transaction: '0x8d3...f91e', network: 'Sui Mainnet',
      action: 'Swap on DeepBook', input: '50 SUI → USDC', output: '49.87 USDC',
      slippage: '0.42%', slippageNote: '(within 0.5% limit)', statusText: 'Success',
      constraintsUsed: 'Risk: Medium\nMax Slippage: 0.50%',
      prevBlob: '0x4f...a2b', newBlob: '0x9c...7de', storage: 'Walrus',
    },
  },
  {
    id: '2', type: 'memory', label: 'Memory updated', agent: 'DeepBook Executor',
    badge: 'Success', badgeColor: '#22C55E', time: '10:24:39 AM', group: 'Today – May 20, 2025',
  },
  {
    id: '3', type: 'capability', label: 'Access capability issued', agent: 'DeepBook Executor',
    badgeText: 'Expires in 09:58', badgeColor: '#22C55E', time: '10:24:33 AM', group: 'Today – May 20, 2025',
  },
  {
    id: '4', type: 'agent', label: 'External agent requested access', agent: 'DeepBook Executor',
    time: '10:24:31 AM', group: 'Today – May 20, 2025',
  },
  {
    id: '5', type: 'state', label: 'State retrieved from Walrus', agent: 'System',
    sub: 'Blob ID: 0x4f...a2b', time: '10:24:35 AM', group: 'Today – May 20, 2025',
  },
  {
    id: '6', type: 'revoked', label: 'Access capability revoked', agent: 'Price Oracle Agent',
    time: '09:15:42 PM', group: 'Yesterday – May 19, 2025',
  },
  {
    id: '7', type: 'execution', label: 'Execution completed', agent: 'Rebalance Agent',
    time: '09:15:38 PM', group: 'Yesterday – May 19, 2025',
  },
  {
    id: '8', type: 'memory', label: 'Memory updated', agent: 'Rebalance Agent',
    time: '09:15:39 PM', group: 'Yesterday – May 19, 2025',
  },
]

export default function ActivityView() {
  const [selected, setSelected] = useState<ActivityEvent | null>(events[0])

  const groups = [...new Set(events.map(e => e.group))]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Page header */}
      <div className="px-8 pt-7 pb-5 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-semibold">Activity</h1>
          <p className="text-white/40 text-sm mt-0.5">Audit log of all agent interactions and state changes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[#22C55E]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" style={{ boxShadow: '0 0 8px #22C55E' }}/>
            Connected
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold">AL</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: event list */}
        <div className="flex-1 overflow-y-auto">
          {/* Filters */}
          <div className="px-8 py-4 flex items-center gap-3 border-b border-white/[0.04] flex-wrap">
            <FilterSelect
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 12c0-2.5 2-4.5 4.5-4.5S12 9.5 12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
              value="All Agents" options={['All Agents', 'DeepBook Executor', 'Rebalance Agent']}
            />
            <FilterSelect
              value="All Actions" options={['All Actions', 'Execution', 'Memory Update', 'Capability']}
            />
            <FilterSelect
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 1v3M9 1v3M2 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
              value="May 18 – May 20" options={['May 18 – May 20']}
            />
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-sm text-white/60 ml-auto">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5h10M4 7.5h6M6 10.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Export
            </button>
          </div>

          {/* Event groups */}
          <div className="px-8 py-5 space-y-6">
            {groups.map(group => {
              const groupEvents = events.filter(e => e.group === group)
              return (
                <div key={group}>
                  <p className="text-white/30 text-xs mb-3">{group}</p>
                  <div className="space-y-1 relative">
                    {/* Timeline line */}
                    <div className="absolute left-[17px] top-5 bottom-5 w-px bg-white/[0.06]"/>

                    {groupEvents.map(event => {
                      const isSelected = selected?.id === event.id
                      const { color } = iconMap[event.type]
                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelected(isSelected && !event.detail ? null : event)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-150 relative ${
                            isSelected
                              ? 'bg-[#7C5CFC]/10 border border-[#7C5CFC]/25'
                              : 'hover:bg-white/[0.04] border border-transparent'
                          }`}
                        >
                          {/* Dot on timeline */}
                          <div
                            className="absolute left-[13px] w-2 h-2 rounded-full z-10"
                            style={{ background: isSelected ? color : 'rgba(255,255,255,0.15)' }}
                          />

                          {/* Icon */}
                          <div className="ml-6">
                            <EventIcon type={event.type} size={34} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium">{event.label}</p>
                              {event.badge && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-md"
                                  style={{ color: event.badgeColor, background: `${event.badgeColor}18` }}
                                >
                                  {event.badge}
                                </span>
                              )}
                              {event.badgeText && (
                                <span className="text-xs" style={{ color: event.badgeColor }}>
                                  {event.badgeText}
                                </span>
                              )}
                            </div>
                            <p className="text-white/35 text-xs mt-0.5">{event.agent}</p>
                            {event.sub && (
                              <p className="text-white/25 text-xs mt-0.5">{event.sub}</p>
                            )}
                          </div>

                          <span className="text-white/30 text-xs font-mono flex-shrink-0">{event.time}</span>

                          {event.detail && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/20 flex-shrink-0">
                              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Load more */}
            <button className="w-full flex items-center justify-center gap-2 py-3 text-white/40 text-sm hover:text-white/70 transition-colors">
              Load more
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right: detail panel */}
        {selected?.detail && (
          <DetailPanel
            detail={selected.detail}
            type={selected.type}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  )
}