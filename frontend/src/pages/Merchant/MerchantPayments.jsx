const METHOD_STYLE = {
  'credit-card':    { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  icon: '💳', label: 'Card'   },
  'debit-card':     { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  icon: '💳', label: 'Card'   },
  'digital-wallet': { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', icon: '📱', label: 'Online' },
  'cash':           { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: '💵', label: 'Cash'   },
}

const DEFAULT_METHOD = { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: '💵', label: 'Cash' }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function MerchantPayments({ theme, orders = [] }) {
  // Only count delivered orders as revenue
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered')

  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0)

  // Group by payment method
  const cardTotal   = deliveredOrders.filter(o => ['credit-card','debit-card'].includes(o.paymentMethod)).reduce((s,o) => s + o.totalAmount, 0)
  const onlineTotal = deliveredOrders.filter(o => o.paymentMethod === 'digital-wallet').reduce((s,o) => s + o.totalAmount, 0)
  const cashTotal   = deliveredOrders.filter(o => !o.paymentMethod || o.paymentMethod === 'cash').reduce((s,o) => s + o.totalAmount, 0)

  // Daily revenue for current week (Sun–Sat)
  const now       = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const dailyRevenue = DAYS.map((day, i) => {
    const dayOrders = deliveredOrders.filter((o) => {
      const d = new Date(o.createdAt)
      return d >= weekStart && d.getDay() === i
    })
    return { day, amount: dayOrders.reduce((s, o) => s + o.totalAmount, 0) }
  })

  const maxDay = Math.max(...dailyRevenue.map(d => d.amount), 1)

  // Recent transactions — last 7 delivered orders
  const recentTransactions = [...deliveredOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 7)

  const safeTotal = totalRevenue || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>Payments</div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>Revenue overview and transaction history</div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(2)}`, color: '#f59e0b' },
          { label: 'Card Payments',   value: `$${cardTotal.toFixed(2)}`,    color: '#60a5fa' },
          { label: 'Online Payments', value: `$${onlineTotal.toFixed(2)}`,  color: '#a78bfa' },
          { label: 'Cash Payments',   value: `$${cashTotal.toFixed(2)}`,    color: '#4ade80' },
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

      {/* Daily revenue bar chart */}
      <div style={{
        background: theme.card, border: `1px solid ${theme.border}`,
        borderRadius: 16, padding: '20px 24px', transition: 'all 0.2s',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 20 }}>
          Daily Revenue — This Week
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
          {dailyRevenue.map((d) => {
            const height = Math.max((d.amount / maxDay) * 120, d.amount > 0 ? 8 : 0)
            const isToday = DAYS[new Date().getDay()] === d.day
            return (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>
                  {d.amount > 0 ? `$${d.amount.toFixed(0)}` : '—'}
                </div>
                <div style={{
                  width: '100%', height: Math.max(height, 4), borderRadius: 6,
                  background: isToday ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                  transition: 'height 0.3s ease',
                }} />
                <div style={{ fontSize: 12, color: isToday ? '#f59e0b' : theme.textMuted, fontWeight: isToday ? 600 : 400 }}>
                  {d.day}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment breakdown + transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>

        {/* Payment methods */}
        <div style={{
          background: theme.card, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: '20px 24px', transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 16 }}>
            Payment Methods
          </div>
          {totalRevenue === 0 ? (
            <div style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', paddingTop: 20 }}>
              No revenue data yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Card',   amount: cardTotal,   icon: '💳', color: '#60a5fa' },
                { label: 'Online', amount: onlineTotal,  icon: '📱', color: '#a78bfa' },
                { label: 'Cash',   amount: cashTotal,   icon: '💵', color: '#f59e0b' },
              ].map((m) => {
                const pct = Math.round((m.amount / safeTotal) * 100)
                return (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: theme.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {m.icon} {m.label}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: theme.bg, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: m.color, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div style={{
          background: theme.card, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: '20px 24px', transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 16 }}>
            Recent Transactions
          </div>
          {recentTransactions.length === 0 ? (
            <div style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', paddingTop: 20 }}>
              No transactions yet. Delivered orders will appear here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentTransactions.map((o) => {
                const ms = METHOD_STYLE[o.paymentMethod] ?? DEFAULT_METHOD
                return (
                  <div key={o._id} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: ms.bg, border: `1px solid ${ms.border}`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 13,
                      }}>
                        {ms.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>
                          {o.user?.fullName ?? 'Customer'}
                        </div>
                        <div style={{ fontSize: 11, color: theme.textMuted }}>
                          {formatDate(o.createdAt)} · {formatTime(o.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>
                        +${o.totalAmount.toFixed(2)}
                      </div>
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 999,
                        background: ms.bg, color: ms.color,
                      }}>
                        {ms.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MerchantPayments