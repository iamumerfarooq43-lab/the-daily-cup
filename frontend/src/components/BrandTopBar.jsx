export default function BrandTopBar() {
  return (
    <div
      className="w-full flex items-center justify-center
                 border-t border-[#2a2a2a] bg-black px-8 py-24"
      role="banner"
    >
      <p
        className="text-center text-[180px] font-bold tracking-tight
                   text-white leading-none"
        style={{ fontFamily: "var(--font-sans, ui-sans-serif, system-ui)" }}
      >
        The Daily Cup
      </p>
    </div>
  );
}