import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const stages = [
  { key: "preparing", label: "Preparing", icon: "☕" },
  { key: "in-progress", label: "On the Way", icon: "🚴" },
  { key: "delivered", label: "Delivered", icon: "✅" },
];

const getStageIndex = (status) => stages.findIndex((s) => s.key === status);

const OrderTracking = ({ order }) => {
  const formatTime = (date) => {
    if (!date) return "—";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const currentStageIndex = getStageIndex(order.status);

  const createCustomIcon = (color, emoji) =>
    L.divIcon({
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <div style="background:${color};width:42px;height:42px;border-radius:50%;
                      display:flex;align-items:center;justify-content:center;
                      border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);
                      font-size:20px;">
            ${emoji}
          </div>
        </div>`,
      iconSize: [42, 52],
      iconAnchor: [21, 52],
      popupAnchor: [0, -52],
      className: "",
    });

  const pickupIcon = createCustomIcon("#a47251", "☕");
  const dropoffIcon = createCustomIcon("#5c4033", "📍");

  const mapCenter = [
    (order.pickupLocation.lat + order.dropoffLocation.lat) / 2,
    (order.pickupLocation.lng + order.dropoffLocation.lng) / 2,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* ── Left: Order Details ── */}
      <div className="bg-fav3 px-6 py-10 pt-28 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Order ID + date */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
              Live Tracking
            </span>
            <h1 className="text-4xl font-bold text-fav5">
              Order <span className="text-fav1">#{order.id}</span>
            </h1>
            <p className="text-fav6 text-sm mt-1">
              Placed on {formatDate(order.orderDate)} at{" "}
              {formatTime(order.orderDate)}
            </p>
          </div>

          {/* ── Status Stepper ── */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-6">
              Order Status
            </p>
            <div className="flex items-start gap-0">
              {stages.map((stage, index) => {
                const isCompleted = index <= currentStageIndex;
                const isActive = index === currentStageIndex;
                return (
                  <div key={stage.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-lg
                                       transition-all duration-300 border-2
                                       ${
                                         isActive
                                           ? "bg-fav1 border-fav1 shadow-lg scale-110"
                                           : isCompleted
                                             ? "bg-fav4 border-fav4"
                                             : "bg-fav3 border-fav3"
                                       }`}
                      >
                        {stage.icon}
                      </div>
                      <p
                        className={`text-xs font-semibold text-center leading-tight
                                     ${isActive ? "text-fav1" : isCompleted ? "text-fav4" : "text-fav7"}`}
                      >
                        {stage.label}
                      </p>
                    </div>
                    {index < stages.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mb-5 mx-1 rounded-full transition-all duration-300
                                       ${index < currentStageIndex ? "bg-fav4" : "bg-fav3"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Timeline ── */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-5">
              Timeline
            </p>
            <div className="space-y-4">
              {[
                { label: "Order Placed", time: order.orderDate, icon: "📋" },
                {
                  label: "Estimated Delivery",
                  time: order.estimatedDelivery,
                  icon: "🕐",
                },
                ...(order.actualDelivery
                  ? [
                      {
                        label: "Delivered",
                        time: order.actualDelivery,
                        icon: "✅",
                      },
                    ]
                  : []),
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-fav3 flex items-center justify-center text-base flex-shrink-0">
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-fav5">
                      {event.label}
                    </p>
                    <p className="text-xs text-fav6">
                      {formatDate(event.time)} · {formatTime(event.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Customer Info ── */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-5">
              Delivery To
            </p>
            <div className="space-y-3">
              {[
                { icon: "👤", label: order.customer.name },
                { icon: "📞", label: order.customer.phone },
                { icon: "📍", label: order.customer.address },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-fav3 flex items-center justify-center text-sm flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-sm text-fav5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Items ── */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-5">
              Order Items
            </p>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-fav1 text-fav3 text-xs font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <span className="text-sm text-fav5">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-fav4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-fav3 pt-3 mt-3 flex justify-between">
                <span className="font-bold text-fav5">Total</span>
                <span className="font-bold text-fav1 text-lg">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Delivery Notes ── */}
          {order.deliveryNotes && (
            <div className="bg-fav2/20 border border-fav2/40 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span>📝</span>
                <p className="text-xs font-semibold tracking-widest uppercase text-fav4">
                  Delivery Notes
                </p>
              </div>
              <p className="text-sm text-fav4 leading-relaxed">
                {order.deliveryNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Map ── */}
      <div
        className="relative"
        style={{ height: "100vh", position: "sticky", top: 0 }}
      >
        {/* Map label */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 z-[999]
                        bg-white/90 backdrop-blur-sm border border-fav3
                        px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-fav5 tracking-wide">
            Live Map
          </span>
        </div>

        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
            maxZoom={20}
          />
          <Marker
            position={[order.pickupLocation.lat, order.pickupLocation.lng]}
            icon={pickupIcon}
          >
            <Popup>
              <p className="font-bold text-fav1">☕ Pickup — The Daily Cup</p>
              <p className="text-xs text-fav6">
                Ready at {formatTime(order.orderDate)}
              </p>
            </Popup>
          </Marker>
          <Marker
            position={[order.dropoffLocation.lat, order.dropoffLocation.lng]}
            icon={dropoffIcon}
          >
            <Popup>
              <p className="font-bold text-fav4">
                📍 Delivery — {order.customer.name}
              </p>
              <p className="text-xs text-fav6">{order.customer.address}</p>
              <p className="text-xs text-fav6">
                ETA: {formatTime(order.estimatedDelivery)}
              </p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default OrderTracking;
