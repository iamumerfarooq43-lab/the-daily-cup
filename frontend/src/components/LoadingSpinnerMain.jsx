// ── Page loading spinner ──
const LoadingSpinnerMain = () => (
  <div className="min-h-screen bg-fav3 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-10 h-10 border-2 border-fav1 border-t-transparent
                      rounded-full animate-spin"
      />
      <p className="text-fav6 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinnerMain;
