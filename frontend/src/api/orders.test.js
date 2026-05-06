import { describe, it, expect } from "vitest";
import { buildOrderPayload } from "./orders.js";

describe("buildOrderPayload", () => {
  it("includes customer, items, and ISO timestamps", () => {
    const payload = buildOrderPayload({
      formData: {
        name: "Alex",
        email: "alex@example.com",
        phone: "1234567890",
        address: "1 Main St",
        promoCode: "SAVE10",
        paymentMethod: "cash",
        deliveryInstructions: "Ring bell",
      },
      cart: [{ id: 1, name: "Latte", price: 5, quantity: 2 }],
      cartTotal: 10,
      finalTotal: 13.98,
      deliveryFee: 2.99,
      serviceFee: 0.99,
      discountAmount: 0,
      dropoffLocation: { lat: 31.47, lng: 74.41 },
    });

    expect(payload.customer.name).toBe("Alex");
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].quantity).toBe(2);
    expect(payload.orderDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(payload.id.startsWith("ORD-")).toBe(true);
    expect(payload.pickupLocation.lat).toBeCloseTo(31.5204, 3);
    expect(payload.dropoffLocation.lat).toBe(31.47);
    expect(payload.deliveryNotes).toBe("Ring bell");
    expect(payload.promoCode).toBe("SAVE10");
  });
});
