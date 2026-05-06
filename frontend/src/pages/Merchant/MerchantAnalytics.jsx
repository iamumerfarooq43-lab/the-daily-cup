const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function MerchantAnalytics({ theme, orders = [] }) {
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered')
  const totalRevenue    = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0)
  const avgOrderValue   = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0

  // Weekly data — current week Sun–Sat
  const now       = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const weeklyData = DAYS.map((day, i) => {
    const dayOrders = orders.filter((o) => {
      const d = new Date(o.createdAt)
      return d >= weekStart && d.getDay() === i
    })
    const dayDelivered = dayOrders.filter(o => o.status === 'Delivered')
    return {
      day,
      orders:  dayOrders.length,
      revenue: dayDelivered.reduce((s, o) => s + o.totalAmount, 0),
    }
  })

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue), 1)
  const maxOrders  = Math.max(...weeklyData.map(d => d.orders),  1)

  // Top items — count across all orders
  const itemMap = {}
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemMap[item.name]) {
        itemMap[item.name] = { name: item.name, orders: 0, revenue: 0 }
      }
      itemMap[item.name].orders  += item.quantity
      itemMap[item.name].revenue += item.price * item.quantity
    })
  })

  const topItems = Object.values(itemMap)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 6)

  const maxItemOrders = Math.max(...topItems.map(i => i.orders), 1)

  // Top item name for stats
  const topItemName = topItems[0]?.name ?? '—'

  const STATS = [
    { label: 'Total Orders',    value: orders.length.toString(),        sub: 'All time',          color: '#f59e0b' },
    { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(2)}`,   sub: 'From delivered',    color: '#4ade80' },
    { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`,  sub: 'Per transaction',   color: '#60a5fa' },
    { label: 'Top Item',        value: topItemName,                      sub: `${topItems[0]?.orders ?? 0} ordered`, color: '#a78bfa' },
  ]

  const todayIndex = now.getDay()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>Analytics</div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>Performance overview for this week</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: '18px 20px', transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 11, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4, wordBreak: 'break-word' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Revenue trend */}
        <div style={{
          background: theme.card, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: '20px 24px', transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 20 }}>
            Revenue Trend — This Week
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130 }}>
            {weeklyData.map((d, i) => {
              const h       = Math.max((d.revenue / maxRevenue) * 110, d.revenue > 0 ? 6 : 0)
              const isToday = i === todayIndex
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>
                    {d.revenue > 0 ? `$${d.revenue.toFixed(0)}` : '—'}
                  </div>
                  <div style={{
                    width: '100%', height: Math.max(h, 4), borderRadius: 6,
                    background: isToday ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                    transition: 'height 0.3s',
                  }} />
                  <div style={{ fontSize: 11, color: isToday ? '#f59e0b' : theme.textMuted, fontWeight: isToday ? 600 : 400 }}>
                    {d.day}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Orders per day */}
        <div style={{
          background: theme.card, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: '20px 24px', transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 20 }}>
            Orders Per Day — This Week
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130 }}>
            {weeklyData.map((d, i) => {
              const h       = Math.max((d.orders / maxOrders) * 110, d.orders > 0 ? 6 : 0)
              const isToday = i === todayIndex
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>
                    {d.orders > 0 ? d.orders : '—'}
                  </div>
                  <div style={{
                    width: '100%', height: Math.max(h, 4), borderRadius: 6,
                    background: isToday ? '#4ade80' : 'rgba(74,222,128,0.3)',
                    transition: 'height 0.3s',
                  }} />
                  <div style={{ fontSize: 11, color: isToday ? '#4ade80' : theme.textMuted, fontWeight: isToday ? 600 : 400 }}>
                    {d.day}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Popular items */}
      <div style={{
        background: theme.card, border: `1px solid ${theme.border}`,
        borderRadius: 16, padding: '20px 24px', transition: 'all 0.2s',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 16 }}>
          Most Popular Items
        </div>
        {topItems.length === 0 ? (
          <div style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', padding: '20px 0' }}>
            No order data yet. Popular items will appear here once orders are placed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topItems.map((item, index) => {
              const pct = Math.round((item.orders / maxItemOrders) * 100)
              return (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: index === 0 ? 'rgba(245,158,11,0.15)' : theme.bg,
                    border: `1px solid ${index === 0 ? 'rgba(245,158,11,0.3)' : theme.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    color: index === 0 ? '#f59e0b' : theme.textMuted,
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{item.name}</span>
                      <span style={{ fontSize: 12, color: theme.textMuted }}>
                        {item.orders} ordered · ${item.revenue.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: theme.bg, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`, borderRadius: 999,
                        background: index === 0 ? '#f59e0b' : 'rgba(245,158,11,0.4)',
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MerchantAnalytics 