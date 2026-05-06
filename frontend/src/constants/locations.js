/**
 * Fixed restaurant pickup — Lahore, Pakistan (Gulberg / Main Blvd area, illustrative).
 * Drop-off comes from the customer’s browser geolocation at checkout.
 */
export const RESTAURANT_PICKUP = {
  lat: 31.5204,
  lng: 74.3587,
  label: "The Daily Cup — Lahore",
};

/** Fallback drop-off near pickup when legacy orders have no GPS pin */
export function defaultDropoffNearRestaurant() {
  return {
    lat: RESTAURANT_PICKUP.lat + 0.012,
    lng: RESTAURANT_PICKUP.lng + 0.015,
  };
}
