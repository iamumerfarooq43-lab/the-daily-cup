import { useState, useEffect } from 'react'
import { getProducts, updateProduct } from '../../api/products'

function MerchantManageItems({ theme }) {
  // copy products into local state so we can edit them
  const [items, setItems] = useState([])
  const [editingId,    setEditingId]    = useState(null)
  const [editingPrice, setEditingPrice] = useState('')

  useEffect(() => {
  const fetch = async () => {
    const data = await getProducts();
    setItems(data);
  };
  fetch();
}, []);


  // toggle item in stock / out of stock
  const toggleStock = async (id) => {
  const item = items.find(i => i._id === id);
  const newInStock = !item.inStock;
  setItems(prev => prev.map(i =>
    i._id === id ? { ...i, inStock: newInStock } : i
  ));
  await updateProduct(id, { inStock: newInStock });
}

// start editing and save price
const startEdit = (item) => {
  setEditingId(item._id)
  setEditingPrice(item.price.toString())
}

const savePrice = async (id) => {
  const newPrice = parseFloat(editingPrice)
  if (!isNaN(newPrice) && newPrice > 0) {
    setItems(prev => prev.map(i =>
      i._id === id ? { ...i, price: newPrice } : i
    ));
    await updateProduct(id, { price: newPrice });
  }
  setEditingId(null)
}

  const categoryColors = {
    Coffee:   { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b'  },
    Tea:      { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80'  },
    Sandwich: { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa'  },
    Salad:    { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa'  },
    Pastry:   { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c'  },
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>
          Manage Items
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>
          Update prices and availability for all menu items
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 16, overflow: 'hidden',
        transition: 'all 0.2s',
      }}>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '12px 20px',
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bg,
        }}>
          {['Item', 'Category', 'Price', 'Availability'].map((h) => (
            <div key={h} style={{
              fontSize: 11, fontWeight: 600,
              color: theme.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {items.map((item, index) => {
          const catStyle = categoryColors[item.category] || {}
          const isEditing = editingId === item._id

          return (
            <div key={item._id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: index < items.length - 1
                ? `1px solid ${theme.border}` : 'none',
              transition: 'background 0.15s',
            }}>

              {/* Item name */}
              <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>
                {item.name}
              </div>

              {/* Category badge */}
              <div>
                <span style={{
                  fontSize: 11, padding: '3px 10px',
                  borderRadius: 999, fontWeight: 500,
                  background: catStyle.bg,
                  color: catStyle.color,
                }}>
                  {item.category}
                </span>
              </div>

              {/* Price — editable */}
              <div>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>$</span>
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      onBlur={() => savePrice(item._id)}
                      onKeyDown={(e) => e.key === 'Enter' && savePrice(item._id)}
                      autoFocus
                      style={{
                        width: 70, padding: '4px 8px',
                        borderRadius: 6, fontSize: 13,
                        background: theme.bg,
                        border: '1px solid rgba(245,158,11,0.4)',
                        color: theme.text, outline: 'none',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => startEdit(item)}
                    style={{
                      fontSize: 13, fontWeight: 600,
                      color: '#f59e0b', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    ${item.price.toFixed(2)}
                    <span style={{ fontSize: 10, color: theme.textMuted }}>✏️</span>
                  </div>
                )}
              </div>

              {/* Availability toggle */}
              <div>
                <button
                  onClick={() => toggleStock(item._id)}
                  style={{
                    fontSize: 11, padding: '5px 14px',
                    borderRadius: 999, cursor: 'pointer',
                    fontWeight: 600, transition: 'all 0.2s',
                    background: item.inStock
                      ? 'rgba(74,222,128,0.1)'
                      : 'rgba(248,113,113,0.1)',
                    border: item.inStock
                      ? '1px solid rgba(74,222,128,0.3)'
                      : '1px solid rgba(248,113,113,0.3)',
                    color: item.inStock ? '#4ade80' : '#f87171',
                  }}
                >
                  {item.inStock ? '✓ Available' : '✗ Out of Stock'}
                </button>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MerchantManageItems