import { useState, useEffect } from 'react'
import Sidebar              from '../../components/MerchantDashboard/Sidebar'
import OrderCard            from '../../components/MerchantDashboard/OrderCard'
import MerchantOrderHistory from './MerchantOrderHistory'
import MerchantPayments     from './MerchantPayments'
import MerchantAnalytics    from './MerchantAnalytics'
import MerchantContactCare  from './MerchantContactCare'
import MerchantManageItems  from './MerchantManageItems'
import { getAllOrders, updateOrderStatus } from '../../api/orders'

function Dashboard() {
  const [activeNav,   setActiveNav]   = useState('Live Orders')
  const [filter,      setFilter]      = useState('All')
  const [orders,      setOrders]      = useState([])
  const [time,        setTime]        = useState('')
  const [isDark,      setIsDark]      = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)

  const theme = {
    bg:        isDark ? '#0c0e14'                : '#f4f5f7',
    card:      isDark ? '#13151f'                : '#ffffff',
    border:    isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    text:      isDark ? '#ffffff'                : '#111827',
    textMuted: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
    topbar:    isDark ? '#13151f'                : '#ffffff',
  }

  // ✅ Single polling useEffect — removed duplicate
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders()
        console.log('✅ Fetched orders:', data)
        setOrders(data)
      } catch (err) {
        console.error('❌ Failed to fetch orders:', err)
      }
    }
    fetchOrders()
    const id = setInterval(fetchOrders, 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const tick = () => {
      const now  = new Date()
      let h      = now.getHours()
      const m    = String(now.getMinutes()).padStart(2, '0')
      const s    = String(now.getSeconds()).padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      setTime(`${h}:${m}:${s} ${ampm}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
    setOrders((prev) =>
      prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
    )
  }

  // ✅ Real stats computed from actual orders
  const today = new Date().toDateString()
  const todaysOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  )
  const todaysRevenue = todaysOrders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const liveOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  )
  const preparingCount  = liveOrders.filter((o) => o.status === 'Preparing').length
  const newCount        = liveOrders.filter((o) => o.status === 'New').length
  const tripCount       = liveOrders.filter((o) => o.status === 'Trip Started').length

  const STATS = [
    {
      label: "Today's Orders",
      value: todaysOrders.length.toString(),
      sub: 'Orders placed today',
      highlight: false,
    },
    {
      label: 'Revenue Today',
      value: `$${todaysRevenue.toFixed(2)}`,
      sub: 'From delivered orders',
      highlight: true,
    },
    {
      label: 'Avg. Delivery',
      value: '30 min',
      sub: 'Estimated delivery time',
      highlight: false,
    },
    {
      label: 'Live Orders',
      value: liveOrders.length.toString(),
      sub: `${preparingCount} preparing · ${newCount} new · ${tripCount} on trip`,
      highlight: true,
    },
  ]

  const filteredOrders =
    filter === 'All'
      ? orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
      : orders.filter((o) => o.status === filter)

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: theme.bg,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: theme.text, overflow: 'hidden',
      transition: 'all 0.2s',
    }}>

      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isDark={isDark}
        theme={theme}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{
          height: 58, background: theme.topbar,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px', flexShrink: 0,
          transition: 'all 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isAvailable ? '#4ade80' : '#f87171',
              boxShadow: isAvailable ? '0 0 8px #4ade80' : '0 0 8px #f87171',
            }} />
            <span style={{ fontSize: 12, color: theme.textMuted }}>Live</span>
            <span style={{
              fontSize: 16, fontWeight: 700, color: theme.text,
              letterSpacing: '0.03em', fontVariantNumeric: 'tabular-nums',
            }}>
              {time}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 14px', borderRadius: 999,
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                transition: 'all 0.2s',
                background: isAvailable ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                border: isAvailable ? '1px solid rgba(74,222,128,0.35)' : '1px solid rgba(248,113,113,0.35)',
                color: isAvailable ? '#4ade80' : '#f87171',
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: isAvailable ? '#4ade80' : '#f87171',
                display: 'inline-block',
              }} />
              {isAvailable ? 'Available' : 'Not Available'}
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: `1px solid ${theme.border}`,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <div style={{ width: 1, height: 24, background: theme.border }} />

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                MRT · Merchant Admin
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>
                Merchant · {isAvailable ? 'Online' : 'Paused'}
              </div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(245,158,11,0.15)',
              border: '2px solid rgba(245,158,11,0.35)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#f59e0b',
            }}>
              M
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '24px 28px',
          background: theme.bg,
          transition: 'all 0.2s',
        }}>

          {!isAvailable && (
            <div style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 12, padding: '14px 20px',
              marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>⏸️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>Orders Paused</div>
                <div style={{ fontSize: 12, color: 'rgba(248,113,113,0.7)' }}>
                  You are not accepting new orders. Toggle "Available" to resume.
                </div>
              </div>
            </div>
          )}

          {/* ✅ Pass real orders to all sub-pages that need them */}
          {activeNav === 'Order History' && <MerchantOrderHistory theme={theme} orders={orders} />}
          {activeNav === 'Payments'      && <MerchantPayments     theme={theme} orders={orders} />}
          {activeNav === 'Analytics'     && <MerchantAnalytics    theme={theme} orders={orders} />}
          {activeNav === 'Contact Care'  && <MerchantContactCare  theme={theme} />}
          {activeNav === 'Manage Items'  && <MerchantManageItems  theme={theme} />}

          {activeNav === 'Live Orders' && (
            <>
              {/* Real stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 14, marginBottom: 28,
              }}>
                {STATS.map((s) => (
                  <div key={s.label} style={{
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 14, padding: '18px 20px',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      fontSize: 11, color: theme.textMuted,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      marginBottom: 10,
                    }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontSize: 28, fontWeight: 700,
                      color: s.highlight ? '#f59e0b' : theme.text,
                      lineHeight: 1, marginBottom: 6,
                    }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 16,
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>
                    Live Orders
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>
                    Real-time orders from customers
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['All', 'New', 'Preparing', 'Trip Started'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      fontSize: 12, padding: '7px 16px',
                      borderRadius: 999, cursor: 'pointer',
                      fontWeight: filter === f ? 600 : 400,
                      transition: 'all 0.15s',
                      background: filter === f ? 'rgba(245,158,11,0.12)' : 'transparent',
                      border: filter === f
                        ? '1px solid rgba(245,158,11,0.35)'
                        : `1px solid ${theme.border}`,
                      color: filter === f ? '#f59e0b' : theme.textMuted,
                    }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
              }}>
                {filteredOrders.length > 0
                  ? filteredOrders.map((order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        isAvailable={isAvailable}
                        theme={theme}
                      />
                    ))
                  : (
                    <div style={{
                      gridColumn: '1 / -1', textAlign: 'center',
                      padding: '60px 0', color: theme.textMuted, fontSize: 14,
                    }}>
                      No orders in this category right now.
                    </div>
                  )
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard