import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "📦", label: "Live Orders", badge: 3 },
  { icon: "🕒", label: "Order History", badge: null },
  { icon: "💳", label: "Payments", badge: null },
  { icon: "📊", label: "Analytics", badge: null },
  { icon: "🛠️", label: "Manage Items", badge: null },
  { icon: "🎧", label: "Contact Care", badge: null },
];

function Sidebar({ activeNav, setActiveNav, isDark, theme, isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay — closes sidebar when tapping outside */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          width: 230,
          flexShrink: 0,
          background: theme.card,
          borderRight: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              ☕
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>
                The Daily Cup
              </div>
              <div style={{ fontSize: 10, color: theme.textMuted }}>
                Merchant Portal
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: theme.textMuted,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <div
          style={{
            flex: 1,
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            overflowY: "auto",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <div
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: isActive ? "rgba(245,158,11,0.1)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(245,158,11,0.2)"
                    : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 13,
                    flex: 1,
                    color: isActive ? "#f59e0b" : theme.textMuted,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    style={{
                      background: "#f59e0b",
                      color: "#000",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Sign out */}
        <div
          style={{ padding: "12px", borderTop: `1px solid ${theme.border}` }}
        >
          <div
            onClick={() => navigate("/merchant/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              color: theme.textMuted,
              transition: "all 0.15s",
            }}
          >
            <span>🚪</span> Sign out
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
