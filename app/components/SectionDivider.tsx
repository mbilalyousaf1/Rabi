export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center my-2 md:my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <div className="px-4 text-red-700 text-2xl font-serif opacity-50">✦</div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </div>
  );
}
