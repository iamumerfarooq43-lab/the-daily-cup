import { Card } from "@/components/ui/card";

const HealthChart = () => {
  // Health data for coffee benefits
  const healthData = [
    { name: "Antioxidants", value: 85, color: "#8B4513" },
    { name: "Energy Boost", value: 70, color: "#D4A574" },
    { name: "Focus & Alertness", value: 75, color: "#A0522D" },
    { name: "Metabolism", value: 60, color: "#DEB887" },
  ];

  return (
    <Card className="w-full p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Health Benefits of Coffee ☕
      </h2>

      {/* Chart bars container */}
      <div className="space-y-6">
        {healthData.map((item) => (
          <div key={item.name} className="flex items-center gap-4">
            {/* Label - item name */}
            <div className="w-32 text-sm font-semibold text-gray-700 truncate">
              {item.name}
            </div>

            {/* Bar container - gray background */}
            <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
              {/* Colored bar - fills based on value */}
              <div
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
                className="h-full flex items-center justify-end pr-3 transition-all duration-500"
              >
                <span className="text-white text-xs font-bold">
                  {item.value}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HealthChart;
