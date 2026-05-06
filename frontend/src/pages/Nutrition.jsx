import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const ITEMS = [
  {
    name: "Flat White",
    category: "Coffee",
    cal: 120,
    pro: 8,
    carbs: 10,
    fat: 4,
  },
  {
    name: "Caramel Latte",
    category: "Coffee",
    cal: 210,
    pro: 7,
    carbs: 32,
    fat: 5,
  },
  { name: "Cold Brew", category: "Coffee", cal: 15, pro: 0, carbs: 3, fat: 0 },
  {
    name: "Cappuccino",
    category: "Coffee",
    cal: 130,
    pro: 8,
    carbs: 12,
    fat: 5,
  },
  { name: "Americano", category: "Coffee", cal: 15, pro: 1, carbs: 3, fat: 0 },
  { name: "Espresso", category: "Coffee", cal: 10, pro: 1, carbs: 2, fat: 0 },
  {
    name: "Matcha Latte",
    category: "Tea",
    cal: 160,
    pro: 5,
    carbs: 22,
    fat: 5,
  },
  { name: "Chai Latte", category: "Tea", cal: 180, pro: 6, carbs: 28, fat: 4 },
  { name: "Earl Grey", category: "Tea", cal: 5, pro: 0, carbs: 1, fat: 0 },
  { name: "Green Tea", category: "Tea", cal: 5, pro: 0, carbs: 1, fat: 0 },
  {
    name: "Chicken Sandwich",
    category: "Sandwich",
    cal: 420,
    pro: 32,
    carbs: 38,
    fat: 14,
  },
  {
    name: "Veggie Wrap",
    category: "Sandwich",
    cal: 320,
    pro: 12,
    carbs: 42,
    fat: 10,
  },
  {
    name: "BLT Sandwich",
    category: "Sandwich",
    cal: 380,
    pro: 18,
    carbs: 35,
    fat: 16,
  },
  {
    name: "Caesar Salad",
    category: "Salad",
    cal: 280,
    pro: 14,
    carbs: 18,
    fat: 16,
  },
  {
    name: "Greek Salad",
    category: "Salad",
    cal: 220,
    pro: 8,
    carbs: 14,
    fat: 14,
  },
  {
    name: "Garden Salad",
    category: "Salad",
    cal: 140,
    pro: 4,
    carbs: 18,
    fat: 6,
  },
  {
    name: "Croissant",
    category: "Pastry",
    cal: 310,
    pro: 6,
    carbs: 32,
    fat: 18,
  },
  {
    name: "Banana Bread",
    category: "Pastry",
    cal: 290,
    pro: 4,
    carbs: 48,
    fat: 9,
  },
  {
    name: "Blueberry Muffin",
    category: "Pastry",
    cal: 340,
    pro: 5,
    carbs: 52,
    fat: 12,
  },
  {
    name: "Cinnamon Roll",
    category: "Pastry",
    cal: 370,
    pro: 6,
    carbs: 58,
    fat: 14,
  },
];

const CATEGORIES = ["All", "Coffee", "Tea", "Sandwich", "Salad", "Pastry"];

const BADGE_STYLES = {
  Coffee: "bg-amber-50   text-amber-900  border border-amber-200",
  Tea: "bg-green-50   text-green-900  border border-green-200",
  Sandwich: "bg-blue-50    text-blue-900   border border-blue-200",
  Salad: "bg-teal-50    text-teal-900   border border-teal-200",
  Pastry: "bg-orange-50  text-orange-900 border border-orange-200",
};

const maxCal = Math.max(...ITEMS.map((i) => i.cal));

import { useState, useMemo } from "react";

function Nutrition() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activecat, setActiveCat] = useState("All");

  // filter items based on search + category
  const filtered = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchCat = activecat === "All" || item.category === activecat;
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activecat]);

  // computed summary stats
  const avgCal = filtered.length
    ? Math.round(filtered.reduce((s, i) => s + i.cal, 0) / filtered.length)
    : 0;
  const avgPro = filtered.length
    ? Math.round(filtered.reduce((s, i) => s + i.pro, 0) / filtered.length)
    : 0;
  const lowestCal = filtered.length
    ? filtered.reduce((a, b) => (a.cal < b.cal ? a : b))
    : null;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-28 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-stone-500
               hover:text-stone-800 transition-colors mb-8
               border border-stone-200 bg-white px-4 py-2
               rounded-full"
        >
          ← Back
        </button>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-stone-900 mb-2">
            Nutrition Guide
          </h1>
          <p className="text-sm text-stone-500">
            Nutritional values per serving for all menu items
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total items", value: filtered.length },
            { label: "Avg. calories", value: `${avgCal} kcal` },
            { label: "Avg. protein", value: `${avgPro}g` },
            { label: "Lowest cal item", value: lowestCal?.name ?? "—" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-stone-200 rounded-xl
                         px-5 py-4"
            >
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="text-lg font-medium text-stone-800 leading-tight">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search + category filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Search */}
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-4 py-2 text-sm border border-stone-200
                       rounded-lg bg-white text-stone-800 outline-none
                       focus:border-stone-400 transition-colors"
          />

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`text-xs px-4 py-2 rounded-full border transition-all
                  ${
                    activecat === cat
                      ? "bg-stone-800 text-amber-50 border-stone-800"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                {[
                  { label: "Item", width: "28%" },
                  { label: "Category", width: "14%" },
                  { label: "Calories", width: "18%" },
                  { label: "Protein", width: "13%" },
                  { label: "Carbs", width: "13%" },
                  { label: "Fat", width: "14%" },
                ].map((h) => (
                  <th
                    key={h.label}
                    style={{ width: h.width }}
                    className="px-5 py-3 text-left text-xs font-medium
                               text-stone-400 uppercase tracking-wider"
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr
                    key={item.name}
                    className={`border-b border-stone-100 hover:bg-stone-50
                                transition-colors
                                ${index === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    {/* Name */}
                    <td className="px-5 py-3 font-medium text-stone-800">
                      {item.name}
                    </td>

                    {/* Category badge */}
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full
                                        ${BADGE_STYLES[item.category]}`}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Calories with bar */}
                    <td className="px-5 py-3">
                      <span className="text-stone-800">{item.cal} kcal</span>
                      <div className="mt-1 h-1 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-600"
                          style={{
                            width: `${Math.round((item.cal / maxCal) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Protein */}
                    <td className="px-5 py-3 text-stone-600">{item.pro}g</td>

                    {/* Carbs */}
                    <td className="px-5 py-3 text-stone-600">{item.carbs}g</td>

                    {/* Fat */}
                    <td className="px-5 py-3 text-stone-600">{item.fat}g</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-stone-400 text-sm"
                  >
                    No items found for "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Row count */}
        <p className="text-xs text-stone-400 mt-3 text-right">
          Showing {filtered.length} of {ITEMS.length} items
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Nutrition;
