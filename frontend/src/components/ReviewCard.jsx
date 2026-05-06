const ReviewCard = ({ review }) => {
  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-fav2" : "text-fav7"}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="group flex-shrink-0 w-72 bg-white rounded-3xl overflow-hidden
                    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top colored band */}
      <div className="w-full h-2 bg-gradient-to-r from-fav1 to-fav2" />

      <div className="p-6 flex flex-col gap-4">
        {/* Header row — avatar + name + date */}
        <div className="flex items-center gap-3">
          <img
            src={review.image}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-fav3 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-fav5 text-sm truncate">
              {review.name}
            </p>
            <p className="text-xs text-fav6">{review.date}</p>
          </div>
          {/* Stars */}
          {renderStars(review.rating)}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-fav3/50" />

        {/* Quote mark */}
        <span className="text-4xl text-fav2 font-serif leading-none -mb-2">
          "
        </span>

        {/* Review text */}
        <p className="text-sm text-fav6 leading-relaxed line-clamp-4">
          {review.review}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
