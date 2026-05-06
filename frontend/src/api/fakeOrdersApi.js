import { orders as seedOrders } from "../data/Orders.js";

export const PLACED_ORDERS_STORAGE_KEY = "coffeeShopPlacedOrders";
const LEGACY_ORDERS_KEY = "userOrders";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readRawList() {
  try {
    const raw = localStorage.getItem(PLACED_ORDERS_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
    const legacy = localStorage.getItem(LEGACY_ORDERS_KEY);
    if (legacy) {
      const arr = JSON.parse(legacy);
      if (Array.isArray(arr) && arr.length > 0) {
        localStorage.setItem(PLACED_ORDERS_STORAGE_KEY, legacy);
        return arr;
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

function writeRawList(list) {
  localStorage.setItem(PLACED_ORDERS_STORAGE_KEY, JSON.stringify(list));
}

/** JSON-safe snapshot for localStorage */
export function toStorableOrder(order) {
  const o = { ...order };
  o.orderDate =
    o.orderDate instanceof Date
      ? o.orderDate.toISOString()
      : typeof o.orderDate === "string"
        ? o.orderDate
        : new Date().toISOString();
  o.estimatedDelivery =
    o.estimatedDelivery instanceof Date
      ? o.estimatedDelivery.toISOString()
      : o.estimatedDelivery ?? null;
  o.actualDelivery =
    o.actualDelivery instanceof Date
      ? o.actualDelivery.toISOString()
      : o.actualDelivery ?? null;
  return o;
}

export function normalizeOrderForUi(order) {
  const o = { ...order };
  o.orderDate = o.orderDate ? new Date(o.orderDate) : new Date();
  o.estimatedDelivery = o.estimatedDelivery
    ? new Date(o.estimatedDelivery)
    : null;
  o.actualDelivery = o.actualDelivery ? new Date(o.actualDelivery) : null;
  if (!o.customer) o.customer = {};
  o.totalPrice = Number(o.totalPrice);
  if (!Number.isFinite(o.totalPrice)) o.totalPrice = 0;
  o.subtotal = Number(o.subtotal);
  if (!Number.isFinite(o.subtotal)) o.subtotal = 0;
  o.deliveryFee = Number(o.deliveryFee);
  if (!Number.isFinite(o.deliveryFee)) o.deliveryFee = 0;
  o.serviceFee = Number(o.serviceFee);
  if (!Number.isFinite(o.serviceFee)) o.serviceFee = 0;
  o.discountAmount = Number(o.discountAmount);
  if (!Number.isFinite(o.discountAmount)) o.discountAmount = 0;
  o.promoCode = String(o.promoCode ?? "").trim();
  o.paymentMethod = String(o.paymentMethod ?? "").trim();
  const notes =
    typeof o.deliveryNotes === "string" && o.deliveryNotes.trim()
      ? o.deliveryNotes.trim()
      : typeof o.deliveryInstructions === "string"
        ? o.deliveryInstructions.trim()
        : "";
  o.deliveryNotes = notes || null;
  o.deliveryInstructions = notes || null;
  o.items = Array.isArray(o.items)
    ? o.items.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
      }))
    : [];
  return o;
}

export function appendPlacedOrder(order) {
  const list = readRawList();
  list.push(toStorableOrder(order));
  writeRawList(list);
}

/**
 * Simulates POST /api/orders: latency + persistence.
 * `payload` must be JSON-ready (e.g. from buildOrderPayload).
 */
export async function fakeSubmitOrder(payload) {
  await delay(450 + Math.floor(Math.random() * 350));
  appendPlacedOrder(payload);
  return {
    usedApi: false,
    usedFakeApi: true,
    payload: normalizeOrderForUi(payload),
  };
}

/** User-placed orders newest first, then demo seed orders (by id de-dupe). */
export function getMergedOrdersForDisplay() {
  const placed = readRawList()
    .map(normalizeOrderForUi)
    .reverse();
  const ids = new Set(placed.map((p) => p.id));
  const rest = seedOrders
    .map(normalizeOrderForUi)
    .filter((s) => !ids.has(s.id));
  return [...placed, ...rest];
}
