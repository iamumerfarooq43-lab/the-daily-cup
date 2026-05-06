import { useState } from 'react'

const STATUS_STYLE = {
  Delivered: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)'  },
  Cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ✅ Receives real orders from Dashboard
function MerchantOrderHistory({ theme, orders = [] }) {
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // ✅ Only show Delivered and Cancelled orders in history
  const historyOrders = orders.filter(
    (o) => o.status === 'Delivered' || o.status === 'Cancelled'
  )

  const filtered = historyOrders.filter((o) => {
    const customerName = o.user?.fullName ?? ''
    const orderId      = o.orderNumber ?? o._id ?? ''
    const matchSearch  = customerName.toLowerCase().includes(search.toLowerCase())
                      || orderId.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = statusFilter === 'All' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = filtered
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>
          Order History
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>
          All past orders and their details
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Search by customer or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '9px 14px',
            borderRadius: 10, fontSize: 13,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            color: theme.text, outline: 'none',
          }}
        />
        {['All', 'Delivered', 'Cancelled'].map((f) => (
          <button key={f} onClick={() => setStatusFilter(f)}
            style={{
              fontSize: 12, padding: '8px 16px',
              borderRadius: 999, cursor: 'pointer',
              fontWeight: statusFilter === f ? 600 : 400,
              transition: 'all 0.15s',
              background: statusFilter === f ? 'rgba(245,158,11,0.12)' : 'transparent',
              border: statusFilter === f
                ? '1px solid rgba(245,158,11,0.35)'
                : `1px solid ${theme.border}`,
              color: statusFilter === f ? '#f59e0b' : theme.textMuted,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 16, overflow: 'hidden',
        transition: 'all 0.2s',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr 0.7fr 0.8fr 0.8fr',
          padding: '12px 20px',
          background: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
        }}>
          {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status'].map((h) => (
            <div key={h} style={{
              fontSize: 11, fontWeight: 600, color: theme.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length > 0 ? filtered.map((order, index) => {
          const ss = STATUS_STYLE[order.status] ?? STATUS_STYLE['Delivered']
          return (
            <div key={order._id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr 0.7fr 0.8fr 0.8fr',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: index < filtered.length - 1
                ? `1px solid ${theme.border}` : 'none',
            }}>
              {/* Order ID */}
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>
                {order.orderNumber ?? order._id}
              </div>

              {/* Customer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11,
                  fontWeight: 700, color: '#f59e0b', flexShrink: 0,
                }}>
                  {order.user?.fullName?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span style={{ fontSize: 13, color: theme.text }}>
                  {order.user?.fullName ?? 'Unknown'}
                </span>
              </div>

              {/* Date */}
              <div style={{ fontSize: 12, color: theme.textMuted }}>
                {formatDate(order.createdAt)}
              </div>

              {/* Items count */}
              <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>
                {order.items.length} items
              </div>

              {/* Total */}
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>
                ${order.totalAmount.toFixed(2)}
              </div>

              {/* Status */}
              <div>
                <span style={{
                  fontSize: 11, padding: '4px 10px',
                  borderRadius: 999, fontWeight: 600,
                  background: ss.bg, color: ss.color,
                  border: `1px solid ${ss.border}`,
                }}>
                  {order.status}
                </span>
              </div>
            </div>
          )
        }) : (
          <div style={{
            padding: '50px', textAlign: 'center',
            color: theme.textMuted, fontSize: 13,
          }}>
            {historyOrders.length === 0
              ? 'No completed orders yet. Orders will appear here once delivered.'
              : 'No orders match your search.'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 20 }}>
        <span style={{ fontSize: 12, color: theme.textMuted }}>
          Showing <strong style={{ color: theme.text }}>{filtered.length}</strong> of{' '}
          <strong style={{ color: theme.text }}>{historyOrders.length}</strong> orders
        </span>
        <span style={{ fontSize: 12, color: theme.textMuted }}>
          Total revenue:{' '}
          <strong style={{ color: '#f59e0b' }}>${totalRevenue.toFixed(2)}</strong>
        </span>
      </div>
    </div>
  )
}

export default MerchantOrderHistory