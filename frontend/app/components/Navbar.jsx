export default function Navbar() {
  return (
    <header className="bg-[#1a1a2e] text-white flex items-center justify-between px-6 py-3 text-sm shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-bold text-base">TaskPulse</span>
        <span className="bg-indigo-600 text-xs px-2 py-0.5 rounded-full">Agentic Workforce Intelligence</span>
      </div>
      <div className="flex items-center gap-4 text-gray-300 text-xs">
        <span>🟢 System Online</span>
        <span>Last sync: 1 min ago</span>
        <span className="bg-indigo-700 text-white px-3 py-1 rounded-full">👤 Operations Lead</span>
      </div>
    </header>
  );
}