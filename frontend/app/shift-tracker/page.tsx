'use client';

const shifts = [
  { dept: 'Production & Baking', shift: '06:00 - 14:00', status: 'Covered', statusColor: 'bg-green-100 text-green-600', staff: '38/38', note: 'No gaps' },
  { dept: 'Logistics & Shipping', shift: '14:00 - 22:00', status: '1 Open', statusColor: 'bg-yellow-100 text-yellow-700', staff: '20/21', note: 'Need 1 dispatcher' },
  { dept: 'Quality & Compliance', shift: '22:00 - 06:00', status: '2 Open', statusColor: 'bg-red-100 text-red-600', staff: '10/12', note: 'Coverage risk' },
  { dept: 'Production & Baking', shift: '22:00 - 06:00', status: 'Late', statusColor: 'bg-red-100 text-red-600', staff: '17/18', note: '1 operator late by 18 min' },
];

const alerts = [
  '2 overnight shifts still unfilled',
  '1 operator late for naan line',
  'Logistics dispatch coverage below target',
];

export default function ShiftTracker() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shift Tracker</h1>
        <p className="text-sm text-gray-500">Live view of shift coverage, attendance, and open staffing gaps</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Shifts', value: '4' },
          { label: 'Covered', value: '1', color: 'text-green-600' },
          { label: 'Open', value: '3', color: 'text-red-500' },
          { label: 'Late Arrivals', value: '1', color: 'text-yellow-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4">
            <div className="text-xs text-gray-400 mb-1">{card.label}</div>
            <div className={`text-2xl font-bold ${card.color || 'text-gray-800'}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Coverage Board</h2>
          <button className="text-indigo-600 text-sm hover:underline">Refresh Live Status →</button>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900">
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Shift</th>
                <th className="text-left p-3">Coverage</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s, i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                  <td className="p-3 font-medium text-gray-800">{s.dept}</td>
                  <td className="p-3 text-gray-500">{s.shift}</td>
                  <td className="p-3 text-gray-700">{s.staff}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.statusColor}`}>{s.status}</span></td>
                  <td className="p-3 text-gray-500">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Open Coverage Alerts</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between bg-orange-50 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-700">{a}</span>
                <button className="text-xs text-indigo-600 font-semibold hover:underline">Assign</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a2e] text-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-3">Ops Summary</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Shift coverage is trending below target for overnight operations. The system should prioritize reassignment for open roles, then escalate any gaps that remain unfilled within the next hour.
          </p>
        </div>
      </div>
    </div>
  );
}
