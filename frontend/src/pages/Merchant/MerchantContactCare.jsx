import { useState, useEffect, useCallback } from 'react'
import { getAllTickets, updateTicketStatus } from '../../api/tickets'

const STATUS_STYLE = {
  Open: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
  Hold: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)'  },
  Solved:{ color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)'  },
}

const CATEGORY_LABEL = {
  order_issue: 'Order Issue',
  support:     'Support Request',
  feedback:    'General Feedback',
}

const formatTime = (d) => {
  if (!d) return '—'
  const diff = Math.floor((Date.now() - new Date(d)) / 60000)
  if (diff < 1)  return 'Just now'
  if (diff < 60) return `${diff} min ago`
  const hrs = Math.floor(diff / 60)
  if (hrs < 24)  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function MerchantContactCare({ theme }) {
  const [tickets,      setTickets]      = useState([])
  const [statusFilter, setStatusFilter] = useState('Open')
  const [loading,      setLoading]      = useState(true)

  const fetchTickets = useCallback(async () => {
    try {
      const data = await getAllTickets()
      setTickets(data)
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch + poll every 10s
  useEffect(() => {
    fetchTickets()
    const id = setInterval(fetchTickets, 10000)
    return () => clearInterval(id)
  }, [fetchTickets])

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus)
      setTickets((prev) =>
        prev.map((t) => t._id === ticketId ? { ...t, status: newStatus } : t)
      )
    } catch (err) {
      console.error('Failed to update ticket:', err)
    }
  }

  // Real stats
  const openCount   = tickets.filter(t => t.status === 'Open').length
  const holdCount   = tickets.filter(t => t.status === 'Hold').length
  const solvedCount = tickets.filter(t => t.status === 'Solved').length

  const filtered = statusFilter === 'All'
    ? tickets
    : tickets.filter(t => t.status === statusFilter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>
          Contact Care
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>
          Customer support tickets and issues
        </div>
      </div>

      {/* Real stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { label: 'Open Tickets',   value: openCount,   color: '#f87171' },
          { label: 'On Hold',        value: holdCount,   color: '#f59e0b' },
          { label: 'Solved Tickets', value: solvedCount, color: '#4ade80' },
        ].map((s) => (
          <div key={s.label} style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: '18px 20px', transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['All', 'Open', 'Hold', 'Solved'].map((f) => (
          <button key={f} onClick={() => setStatusFilter(f)} style={{
            fontSize: 12, padding: '7px 16px',
            borderRadius: 999, cursor: 'pointer',
            fontWeight: statusFilter === f ? 600 : 400,
            transition: 'all 0.15s',
            background: statusFilter === f ? 'rgba(245,158,11,0.12)' : 'transparent',
            border: statusFilter === f
              ? '1px solid rgba(245,158,11,0.35)'
              : `1px solid ${theme.border}`,
            color: statusFilter === f ? '#f59e0b' : theme.textMuted,
          }}>
            {f} {f !== 'All' && tickets.filter(t => t.status === f).length > 0 &&
              `(${tickets.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Tickets */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.textMuted, fontSize: 13 }}>
          Loading tickets...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: theme.card, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: '50px', textAlign: 'center',
          color: theme.textMuted, fontSize: 13,
        }}>
          {statusFilter === 'Open'
            ? '🎉 No open tickets right now.'
            : `No ${statusFilter.toLowerCase()} tickets found.`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((t) => {
            const ss = STATUS_STYLE[t.status] ?? STATUS_STYLE.Open
            return (
              <div key={t._id} style={{
                background: theme.card,
                border: `1px solid ${ss.border}`,
                borderRadius: 16, padding: '18px 20px',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>

                  {/* Left — ticket info */}
                  <div style={{ flex: 1 }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>
                        {t.ticketNumber}
                      </span>
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 999,
                        background: ss.bg, color: ss.color,
                        border: `1px solid ${ss.border}`, fontWeight: 600,
                      }}>
                        {t.status}
                      </span>
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 999,
                        background: 'rgba(96,165,250,0.1)', color: '#60a5fa',
                        border: '1px solid rgba(96,165,250,0.25)', fontWeight: 500,
                      }}>
                        {CATEGORY_LABEL[t.category] ?? t.category}
                      </span>
                      <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 'auto' }}>
                        {formatTime(t.createdAt)}
                      </span>
                    </div>

                    {/* Customer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#f59e0b', flexShrink: 0,
                      }}>
                        {t.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted }}>{t.email}</div>
                      </div>
                    </div>

                    {/* Message */}
                    <div style={{
                      fontSize: 12, color: theme.textMuted,
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10, padding: '10px 14px',
                      lineHeight: 1.6,
                    }}>
                      📝 {t.message}
                    </div>
                  </div>

                  {/* Right — action buttons */}
                  {t.status !== 'Solved' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      {t.status === 'Open' && (
                        <button
                          onClick={() => handleStatusChange(t._id, 'Hold')}
                          style={{
                            padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                            background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.35)',
                            color: '#f59e0b',
                          }}
                        >
                          ⏸ Put on Hold
                        </button>
                      )}
                      {t.status === 'Hold' && (
                        <button
                          onClick={() => handleStatusChange(t._id, 'Open')}
                          style={{
                            padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                            background: 'rgba(248,113,113,0.1)',
                            border: '1px solid rgba(248,113,113,0.35)',
                            color: '#f87171',
                          }}
                        >
                          ↩ Reopen
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(t._id, 'Solved')}
                        style={{
                          padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                          background: 'rgba(74,222,128,0.1)',
                          border: '1px solid rgba(74,222,128,0.35)',
                          color: '#4ade80',
                        }}
                      >
                        ✓ Mark Solved
                      </button>
                    </div>
                  )}

                  {/* Solved state — no buttons, just a checkmark */}
                  {t.status === 'Solved' && (
                    <div style={{
                      fontSize: 22, flexShrink: 0,
                      opacity: 0.6,
                    }}>
                      ✅
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MerchantContactCare