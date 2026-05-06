const STATUS_CONFIG = {
  'New': {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    action: '✓ Accept Order',
    next: 'Preparing',
  },
  'Preparing': {
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.3)',
    action: '🛵 Start Trip',
    next: 'Trip Started',
  },
  'Trip Started': {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.1)',
    border: 'rgba(74,222,128,0.3)',
    action: '✓ Mark Delivered',
    next: 'Delivered',
  },
}

// ✅ Helper: format createdAt → "2:34 PM"
const formatTime = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OrderCard({ order, onStatusChange, theme }) {
  const sc = STATUS_CONFIG[order.status]

  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${sc.border}`,
      borderRadius: 16,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      transition: 'all 0.2s',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
          {order.orderNumber ?? order._id}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          padding: '4px 12px', borderRadius: 999,
          background: sc.bg, color: sc.color,
          border: `1px solid ${sc.border}`,
        }}>
          {order.status}
        </span>
      </div>

      {/* Customer info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 10, padding: '10px 12px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: sc.bg, border: `1px solid ${sc.border}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
          color: sc.color, flexShrink: 0,
        }}>
          {order.user?.fullName?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
            {order.user?.fullName ?? 'Unknown Customer'}
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            {order.deliveryAddress}
          </div>
        </div>
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {order.items.map((item) => (
          <div
            key={item._id ?? item.name}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ fontSize: 12, color: theme.textMuted }}>
              {item.name}
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 11, color: theme.textMuted, opacity: 0.6 }}>
                ×{item.quantity}  {/* ✅ FIX 1: was item.qty */}
              </span>
              <span style={{ fontSize: 12, color: theme.textMuted, minWidth: 40, textAlign: 'right' }}>
                ${item.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: theme.border }} />

      {/* Total + ETA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: 10, color: theme.textMuted,
            marginBottom: 3, textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Total
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>
            ${order.totalAmount.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 10, color: theme.textMuted,
            marginBottom: 3, textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            ETA
          </div>
          {/* ✅ FIX 2+3: background removed from text div, dot uses estimatedDelivery */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 15, fontWeight: 700,
            color: order.estimatedDelivery <= 5 ? '#4ade80' : theme.text,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: order.estimatedDelivery <= 5 ? '#4ade80' : theme.border,
              display: 'inline-block',
            }} />
            {order.estimatedDelivery ?? 30} min
          </div>
        </div>
      </div>

      {/* Action button */}
      {order.status !== 'Delivered' && (
        <button
          onClick={() => onStatusChange(order._id, sc.next)}
          style={{
            width: '100%', padding: '12px',
            borderRadius: 10,
            border: `1px solid ${sc.border}`,
            background: sc.bg, color: sc.color,
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.02em',
            transition: 'all 0.2s',
          }}
        >
          {sc.action}
        </button>
      )}

      {/* ✅ FIX 4: was order.time — model has createdAt from timestamps */}
      <div style={{
        fontSize: 11, color: theme.textMuted,
        textAlign: 'center', marginTop: -6,
      }}>
        {formatTime(order.createdAt)}
      </div>

    </div>
  )
}

export default OrderCard