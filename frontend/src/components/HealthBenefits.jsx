const benefits = [
  {
    title: "Boosts Energy & Focus",
    description:
      "Caffeine stimulates the central nervous system, increasing alertness and concentration for up to 5 hours.",
    icon: "⚡",
    tip: "Best time: Morning or pre-workout",
  },
  {
    title: "Rich in Antioxidants",
    description:
      "Coffee contains powerful antioxidants like chlorogenic acid that help protect cells from damage.",
    icon: "🛡️",
    tip: "1 cup = more antioxidants than fruits",
  },
  {
    title: "Supports Brain Health",
    description:
      "Regular coffee consumption is linked to reduced risk of Alzheimer's and Parkinson's diseases.",
    icon: "🧠",
    tip: "3-5 cups daily shows best results",
  },
  {
    title: "Enhances Performance",
    description:
      "Caffeine increases endurance and reduces perceived effort during physical exercise.",
    icon: "💪",
    tip: "Drink 45 mins before exercise",
  },
  {
    title: "Promotes Heart Health",
    description:
      "Moderate coffee consumption (3-5 cups daily) may reduce cardiovascular disease risk.",
    icon: "❤️",
    tip: "Moderation is key",
  },
  {
    title: "Aids Metabolism",
    description:
      "Coffee can boost metabolic rate by 3-11%, helping with weight management.",
    icon: "🔥",
    tip: "Black coffee works best",
  },
];

const HealthBenefits = () => {
  return (
    <section className="py-24 px-4 bg-fav3">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
            Why Coffee
          </span>
          <h2 className="text-5xl font-bold text-fav5 leading-tight">
            Health{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-fav1">Benefits</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
            </span>
          </h2>
          <p className="text-fav6 mt-4 text-base max-w-xl">
            Science-backed reasons why your daily cup is doing more good than
            you think.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              {/* Icon + number */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-fav3 flex items-center justify-center text-2xl">
                  {benefit.icon}
                </div>
                <span className="text-3xl font-bold text-fav3 group-hover:text-fav2 transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-fav5 mb-2 group-hover:text-fav1 transition-colors duration-300">
                {benefit.title}
              </h3>

              {/* Divider */}
              <div className="w-8 h-0.5 bg-fav1 rounded-full mb-3" />

              {/* Description */}
              <p className="text-sm text-fav6 leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Tip */}
              <div className="flex items-center gap-2 bg-fav3/50 px-3 py-2 rounded-xl">
                <span className="text-fav1 text-xs">💡</span>
                <p className="text-xs text-fav4 font-medium">{benefit.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthBenefits;
