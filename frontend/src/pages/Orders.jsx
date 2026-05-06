import "leaflet/dist/leaflet.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../api/orders.js";
import {
  RESTAURANT_PICKUP,
  defaultDropoffNearRestaurant,
} from "../constants/locations.js";

// ── Status mapping: DB values → display values ──
const STATUS_LABEL = {
  'New':         'preparing',
  'Preparing':   'preparing',
  'Trip Started':'in-progress',
  'Delivered':   'delivered',
  'Cancelled':   'delivered', // show in history
}

const stages = [
  { key: "preparing",   label: "Preparing", icon: "☕" },
  { key: "in-progress", label: "On the Way", icon: "🚴" },
  { key: "delivered",   label: "Delivered",  icon: "✅" },
];

function createMapIcon(color, emoji) {
  return L.divIcon({
    html: `<div style="background:${color};width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:18px;">${emoji}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
    className: "",
  });
}

function getPickupForMap() {
  return { lat: RESTAURANT_PICKUP.lat, lng: RESTAURANT_PICKUP.lng };
}

function getDropoffForMap(order) {
  // dropoffLocation saved during checkout geolocation step
  const d = order?.dropoffLocation;
  if (d?.lat != null && d?.lng != null) return { lat: d.lat, lng: d.lng };
  return defaultDropoffNearRestaurant();
}

function CourierMarker({ pickup, dropoff, show }) {
  const [progress, setProgress] = useState(0.22);

  useEffect(() => {
    if (!show) return;
    let dir = 1;
    const id = window.setInterval(() => {
      setProgress((prev) => {
        let n = prev + 0.02 * dir;
        if (n >= 0.9) dir = -1;
        if (n <= 0.12) dir = 1;
        return n;
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [show]);

  if (!show) return null;

  const lat = pickup.lat + (dropoff.lat - pickup.lat) * progress;
  const lng = pickup.lng + (dropoff.lng - pickup.lng) * progress;

  return (
    <Marker position={[lat, lng]} icon={createMapIcon("#1b7f5a", "🚴")}>
      <Popup>
        <p className="font-bold text-sm">Rider</p>
        <p className="text-xs text-gray-600">Live route estimate</p>
      </Popup>
    </Marker>
  );
}

const formatTime = (d) => {
  if (!d) return "—";
  const t = new Date(d);
  if (isNaN(t)) return "—";
  return t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDate = (d) => {
  if (!d) return "—";
  const t = new Date(d);
  if (isNaN(t)) return "—";
  return t.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const statusColor = (status) => {
  if (status === "delivered")   return "bg-green-500/20 text-green-600 border border-green-500/30";
  if (status === "in-progress") return "bg-fav2/20 text-fav1 border border-fav2/30";
  return "bg-fav3 text-fav6 border border-fav3";
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // ── Fetch real orders from backend ──
  const fetchOrders = useCallback(async () => {
    try {
      const data = await getMyOrders();
      // Normalize: map DB status → display status
      const normalized = data.map((o) => ({
        ...o,
        displayStatus: STATUS_LABEL[o.status] ?? 'preparing',
      }));
      setOrders(normalized);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Poll every 5 seconds for status updates ──
  useEffect(() => {
    const id = setInterval(fetchOrders, 5000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const currentOrders = orders.filter((o) => o.displayStatus !== "delivered");
  const pastOrders    = orders.filter((o) => o.displayStatus === "delivered");

  const activeOrder = currentOrders[0] || orders[0];
  const stageIndex  = activeOrder
    ? stages.findIndex((s) => s.key === activeOrder.displayStatus)
    : -1;

  const pickupLoc  = getPickupForMap();
  const dropoffLoc = activeOrder ? getDropoffForMap(activeOrder) : defaultDropoffNearRestaurant();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-fav1 border-t-transparent rounded-full animate-spin" />
            <p className="text-fav6 text-sm">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee] flex flex-col">
      <Navbar />

      <div className="max-w-[1500px] mx-auto px-2 pt-25 pb-16 w-full">

        {/* ── Page Header ── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-fav6 hover:text-fav1 text-sm flex items-center gap-2 mb-4 transition-colors font-medium"
            >
              ← Back
            </button>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-3">
              Order Tracking
            </span>
            <h1 className="text-5xl font-bold text-fav5 leading-tight">
              Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav1">Orders</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
              </span>
            </h1>
          </div>

          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 border shadow-sm
                        ${historyOpen ? "bg-fav1 text-fav3 border-fav1 shadow-lg" : "bg-white text-fav5 border-fav3 hover:border-fav1"}`}
          >
            <span>🕐</span>
            Order History
            {pastOrders.length > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center
                                ${historyOpen ? "bg-fav3/20 text-fav3" : "bg-fav1 text-fav3"}`}>
                {pastOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Order History Panel ── */}
        {historyOpen && (
          <div className="mb-10 bg-white rounded-3xl shadow-sm border border-fav3/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-fav3/50 bg-fav3/20">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-fav6">Previous Orders</p>
                <p className="text-sm font-bold text-fav5 mt-0.5">{pastOrders.length} completed orders</p>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-fav3 flex items-center justify-center text-fav6 hover:text-fav1 hover:border-fav1 transition-all text-lg"
              >×</button>
            </div>

            <div className="divide-y divide-fav3/40">
              {pastOrders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-4xl mb-3">☕</p>
                  <p className="text-fav5 font-bold">No past orders yet</p>
                  <p className="text-fav6 text-sm mt-1">Your completed orders will appear here</p>
                </div>
              ) : (
                pastOrders.map((o) => (
                  <div key={o._id} className="px-6 py-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-lg flex-shrink-0">✅</div>
                        <div>
                          <p className="text-sm font-bold text-fav5">{o.orderNumber ?? o._id}</p>
                          <p className="text-xs text-fav6 mt-0.5">
                            {formatDate(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(o.displayStatus)}`}>
                          {o.status}
                        </span>
                        <span className="font-bold text-fav1">${o.totalAmount.toFixed(2)}</span>
                        <span className={`text-fav6 transition-transform duration-300 ${expandedOrder === o._id ? "rotate-180" : ""}`}>▾</span>
                      </div>
                    </div>

                    {expandedOrder === o._id && (
                      <div className="mt-4 pt-4 border-t border-fav3/40 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-3">Items Ordered</p>
                          <div className="space-y-2">
                            {o.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-fav1 text-fav3 text-[10px] font-bold flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                  <span className="text-sm text-fav5">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-fav4">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-fav3/50 pt-2 mt-1 flex justify-between">
                              <span className="text-sm font-bold text-fav5">Total</span>
                              <span className="text-sm font-bold text-fav1">${o.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-3">Delivery Details</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">📍</span>
                              <p className="text-xs text-fav6">{o.deliveryAddress}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">🕐</span>
                              <p className="text-xs text-fav6">Placed at {formatTime(o.createdAt)}</p>
                            </div>
                            {o.specialInstructions && (
                              <div className="mt-2 bg-fav3/50 rounded-xl p-3">
                                <p className="text-xs font-semibold text-fav6 mb-0.5">Special instructions</p>
                                <p className="text-xs text-fav4">📝 {o.specialInstructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Current Orders ── */}
        {currentOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-fav3/50 shadow-sm">
            <p className="text-5xl mb-4">☕</p>
            <p className="text-fav5 font-bold text-xl mb-2">No active orders</p>
            <p className="text-fav6 text-sm mb-6">Place an order to start tracking it here</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-fav1 hover:bg-fav4 text-fav3 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            >
              Browse Menu →
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-sm font-semibold text-fav5">
                Active Order · <span className="text-fav1">{activeOrder.orderNumber ?? activeOrder._id}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* ── Left Details ── */}
              <div className="lg:col-span-2 space-y-4">

                {/* Status banner */}
                <div className="bg-fav5 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-fav4/30 -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-fav4/20 translate-y-6 -translate-x-6" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold tracking-widest uppercase text-fav7">Order</p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(activeOrder.displayStatus)}`}>
                        {activeOrder.status}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-fav3 mb-1">
                      {activeOrder.orderNumber ?? activeOrder._id}
                    </h2>
                    <p className="text-xs text-fav7">
                      {formatDate(activeOrder.createdAt)} · {formatTime(activeOrder.createdAt)}
                    </p>

                    {/* Stepper */}
                    <div className="flex items-start mt-6">
                      {stages.map((stage, i) => (
                        <div key={stage.key} className="flex items-center flex-1">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all
                                            ${i === stageIndex ? "bg-fav2 border-fav2 scale-110 shadow-lg"
                                              : i < stageIndex ? "bg-fav4 border-fav4"
                                              : "bg-fav4/20 border-fav4/20"}`}>
                              {stage.icon}
                            </div>
                            <p className={`text-[10px] font-semibold ${i <= stageIndex ? "text-fav3" : "text-fav7/40"}`}>
                              {stage.label}
                            </p>
                          </div>
                          {i < stages.length - 1 && (
                            <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < stageIndex ? "bg-fav4" : "bg-fav4/20"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ETA — estimatedDelivery is minutes, not a Date */}
                <div className="bg-fav1 rounded-3xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-fav3/70">Estimated Delivery</p>
                    <p className="text-3xl font-bold text-fav3 mt-1">
                      {activeOrder.estimatedDelivery ?? 30} min
                    </p>
                    <p className="text-xs text-fav3/70 mt-0.5">from order placement</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-fav3/20 flex items-center justify-center text-3xl">🚴</div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-fav3/50">
                  <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-5">Order Items</p>
                  <div className="space-y-3">
                    {activeOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-fav3/40 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-fav3 text-fav4 text-xs font-bold flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <span className="text-sm text-fav5">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-fav4">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1">
                      <span className="font-bold text-fav5">Total</span>
                      <span className="font-bold text-fav1 text-lg">${activeOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Special instructions */}
                {activeOrder.specialInstructions && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-fav3/50">
                    <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-2">Delivery Instructions</p>
                    <div className="rounded-xl bg-fav3/40 p-3 border border-fav3/60">
                      <p className="text-sm text-fav5 leading-relaxed">📝 {activeOrder.specialInstructions}</p>
                    </div>
                  </div>
                )}

                {/* Delivery address */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-fav3/50">
                  <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-4">Delivering To</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-fav3 flex items-center justify-center text-sm flex-shrink-0">📍</div>
                    <p className="text-sm text-fav5">{activeOrder.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* ── Right Map ── */}
              <div className="lg:col-span-3">
                <div
                  className="rounded-3xl overflow-hidden shadow-lg sticky top-24 border border-fav3/50 relative"
                  style={{ height: "580px" }}
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] bg-white/95 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-fav3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-fav5">Live Tracking</span>
                  </div>
                  <MapContainer
                    center={[(pickupLoc.lat + dropoffLoc.lat) / 2, (pickupLoc.lng + dropoffLoc.lng) / 2]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution="&copy; OpenStreetMap &copy; CARTO"
                      maxZoom={20}
                    />
                    <Marker position={[pickupLoc.lat, pickupLoc.lng]} icon={createMapIcon("#a47251", "☕")}>
                      <Popup>
                        <p className="font-bold">☕ {RESTAURANT_PICKUP.label}</p>
                        <p className="text-xs text-gray-600">Pick-up · Lahore</p>
                      </Popup>
                    </Marker>
                    <CourierMarker
                      pickup={pickupLoc}
                      dropoff={dropoffLoc}
                      show={activeOrder.displayStatus !== "delivered"}
                    />
                    <Marker position={[dropoffLoc.lat, dropoffLoc.lng]} icon={createMapIcon("#5c4033", "📍")}>
                      <Popup>
                        <p className="font-bold">📍 Drop-off</p>
                        <p className="text-xs text-gray-600">{activeOrder.deliveryAddress}</p>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}