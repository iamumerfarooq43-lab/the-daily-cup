const BeanCard = ({ bean }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={bean.image}
          alt={bean.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-fav5/60 to-transparent" />

        {/* Origin badge */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
          <span className="text-lg">🌱</span>
          <span className="text-xs font-semibold text-white tracking-wide">
            {bean.origin}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-fav5 group-hover:text-fav1 transition-colors duration-300">
          {bean.name}
        </h3>
        <div className="w-8 h-0.5 bg-fav1 rounded-full" />
        <p className="text-xs text-fav6 leading-relaxed line-clamp-3">
          {bean.description}
        </p>
      </div>
    </div>
  );
};

export default BeanCard;
