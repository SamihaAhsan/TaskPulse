'use client';

const teams = [
  { name: 'Production & Baking', capacity: 84, target: 90, staff: 38, needed: 3, status: 'Understaffed', statusColor: 'bg-red-100 text-red-600' },
  { name: 'Logistics & Shipping', capacity: 91, target: 88, staff: 21, needed: 0, status: 'Optimal', statusColor: 'bg-green-100 text-green-600' },
  { name: 'Quality & Compliance', capacity: 75, target: 85, staff: 12, needed: 2, status: 'Attention Required', statusColor: 'bg-yellow-100 text-yellow-700' },
];

const skills = [
  { skill: 'Equipment Maintenance', matched: 7, required: 9 },
  { skill: 'Quality Control', matched: 8, required: 8 },
  { skill: 'Logistics Coordination', matched: 6, required: 7 },
  { skill: 'Compliance Audit', matched: 4, required: 6 },
];

export default function WorkforcePlanner() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Workforce Planner</h1>
        <p className="text-sm text-gray-500">Capacity, staffing gaps, and skill coverage across active teams</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Staff', value: '71' },
          { label: 'Open Gaps', value: '5', color: 'text-red-500' },
          { label: 'Avg Utilization', value: '87%', color: 'text-indigo-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4">
            <div className="text-xs text-gray-400 mb-1">{card.label}</div>
            <div className={`text-2xl font-bold ${card.color || 'text-gray-800'}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Team Capacity</h2>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Live</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.name} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-gray-800">{team.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${team.statusColor}`}>{team.status}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">Staff: <span className="text-gray-800 font-bold">{team.staff}</span></div>
              <div className="text-xs text-gray-500 mb-1">Capacity: <span className="text-gray-800 font-bold">{team.capacity}%</span></div>
              <div className="text-xs text-gray-500">Needed: <span className="text-gray-800 font-bold">{team.needed}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Skill Coverage</h2>
          <button className="text-indigo-600 text-sm hover:underline">View Staff Profiles →</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {skills.map(item => (
            <div key={item.skill} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{item.skill}</span>
                <span className="text-xs text-gray-500">{item.matched}/{item.required} matched</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (item.matched / item.required) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
