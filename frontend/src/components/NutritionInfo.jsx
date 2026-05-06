import { useState } from "react";

const nutritionData = {
  espresso: {
    name: "Espresso",
    size: "1 shot",
    calories: 3,
    caffeine: 63,
    protein: 0.1,
    fat: 0.2,
    carbs: 0,
    description: "Pure concentrated coffee shot",
    icon: "☕",
  },
  cappuccino: {
    name: "Cappuccino",
    size: "8oz",
    calories: 120,
    caffeine: 75,
    protein: 7,
    fat: 4,
    carbs: 8,
    description: "Espresso with steamed milk and foam",
    icon: "🥛",
  },
  latte: {
    name: "Latte",
    size: "12oz",
    calories: 190,
    caffeine: 75,
    protein: 13,
    fat: 7,
    carbs: 18,
    description: "Espresso with more steamed milk",
    icon: "☕",
  },
  americano: {
    name: "Americano",
    size: "12oz",
    calories: 15,
    caffeine: 154,
    protein: 0.3,
    fat: 0,
    carbs: 0,
    description: "Espresso diluted with hot water",
    icon: "💧",
  },
  coldbrew: {
    name: "Cold Brew",
    size: "12oz",
    calories: 5,
    caffeine: 200,
    protein: 0,
    fat: 0,
    carbs: 0,
    description: "Smooth, less acidic brew",
    icon: "🧊",
  },
};

const nutrients = [
  { key: "calories", label: "Calories", unit: "", color: "bg-fav1", max: 200 },
  {
    key: "caffeine",
    label: "Caffeine",
    unit: "mg",
    color: "bg-fav2",
    max: 200,
  },
  { key: "protein", label: "Protein", unit: "g", color: "bg-fav4", max: 15 },
  { key: "fat", label: "Fat", unit: "g", color: "bg-fav6", max: 10 },
  { key: "carbs", label: "Carbs", unit: "g", color: "bg-fav8", max: 20 },
];

const NutritionInfo = () => {
  const [selectedDrink, setSelectedDrink] = useState("espresso");
  const drink = nutritionData[selectedDrink];

  return (
    <section className="py-24 px-4 bg-fav5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav2 border border-fav2 px-4 py-1.5 rounded-full mb-4">
            Nutrition Facts
          </span>
          <h2 className="text-5xl font-bold text-fav3 leading-tight">
            What's in{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-fav2">Your Cup</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-fav1 opacity-40 rounded-sm -z-0" />
            </span>
          </h2>
          <p className="text-fav7 mt-4 text-base">
            Select a drink to see its full nutrition breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Drink Selector ── */}
          <div className="flex flex-col gap-3">
            {Object.entries(nutritionData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedDrink(key)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-left
                            transition-all duration-300 border
                            ${
                              selectedDrink === key
                                ? "bg-fav1 border-fav1 shadow-lg"
                                : "bg-fav4/30 border-fav4 hover:border-fav1"
                            }`}
              >
                <span className="text-2xl">{data.icon}</span>
                <div>
                  <p
                    className={`font-bold text-sm ${selectedDrink === key ? "text-fav3" : "text-fav3"}`}
                  >
                    {data.name}
                  </p>
                  <p
                    className={`text-xs ${selectedDrink === key ? "text-fav3/70" : "text-fav6"}`}
                  >
                    {data.size}
                  </p>
                </div>
                {selectedDrink === key && (
                  <span className="ml-auto text-fav3 text-lg">→</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Right: Nutrition Details ── */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
            {/* Drink header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-fav3 flex items-center justify-center text-3xl">
                {drink.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-fav5">{drink.name}</h3>
                <p className="text-fav6 text-sm">
                  {drink.description} · {drink.size}
                </p>
              </div>
            </div>

            {/* Nutrient bars */}
            <div className="space-y-5">
              {nutrients.map((nutrient) => {
                const value = drink[nutrient.key];
                const pct = Math.min((value / nutrient.max) * 100, 100);
                return (
                  <div key={nutrient.key}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-fav5">
                        {nutrient.label}
                      </span>
                      <span className="text-sm font-bold text-fav4">
                        {value}
                        {nutrient.unit}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-fav3/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${nutrient.color} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily intake note */}
            <div className="mt-8 p-4 bg-fav3/30 rounded-2xl flex items-start gap-3">
              <span className="text-lg">💡</span>
              <p className="text-xs text-fav4 leading-relaxed">
                <span className="font-bold">Daily recommendation:</span> Up to
                400mg of caffeine per day is considered safe for healthy adults.
                That's roughly 4 cups of espresso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionInfo;
