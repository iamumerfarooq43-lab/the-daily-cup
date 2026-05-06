import { RESTAURANT_PICKUP } from "../constants/locations.js";

const demoDropA = { lat: 31.5281, lng: 74.3412 };
const demoDropB = { lat: 31.5129, lng: 74.3715 };

export const orders = [
  {
    id: "SHP-5567",
    status: "in-progress",
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
    actualDelivery: null,
    customer: {
      name: "John Doe",
      phone: "+92 300 1234567",
      address: "Gulberg III, Lahore",
    },
    items: [
      { name: "Cappuccino", quantity: 2, price: 5.99 },
      { name: "Espresso", quantity: 1, price: 3.99 },
      { name: "Croissant", quantity: 2, price: 4.99 },
    ],
    totalPrice: 25.95,
    subtotal: 22.96,
    deliveryFee: 2.99,
    serviceFee: 0.99,
    discountAmount: 0,
    promoCode: "SAVE10",
    deliveryNotes: "Ring bell twice. Leave at door if no answer.",
    pickupLocation: { lat: RESTAURANT_PICKUP.lat, lng: RESTAURANT_PICKUP.lng },
    dropoffLocation: demoDropA,
  },
  {
    id: "SHP-5568",
    status: "delivered",
    orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() - 23 * 60 * 60 * 1000),
    actualDelivery: new Date(Date.now() - 23.5 * 60 * 60 * 1000),
    customer: {
      name: "Sarah Smith",
      phone: "+92 321 9876543",
      address: "DHA Phase 5, Lahore",
    },
    items: [
      { name: "Latte", quantity: 1, price: 5.99 },
      { name: "Blueberry Muffin", quantity: 1, price: 4.99 },
    ],
    totalPrice: 10.98,
    subtotal: 10.98,
    deliveryFee: 0,
    serviceFee: 0,
    discountAmount: 0,
    promoCode: "",
    deliveryNotes: "No sugar in coffee please",
    pickupLocation: { lat: RESTAURANT_PICKUP.lat, lng: RESTAURANT_PICKUP.lng },
    dropoffLocation: demoDropB,
  },
];