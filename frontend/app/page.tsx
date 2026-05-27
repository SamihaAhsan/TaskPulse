'use client';
import { useState } from 'react';

const navItems = ['Dashboard', 'Tasks Hub', 'Workforce Planner', 'Demand Forecasting', 'Shift Tracker', 'Reports Hub', 'Skills Pods', 'Settings'];

const departments = [
  { name: 'Production & Baking', status: 'Understaffed', statusColor: 'bg-red-100 text-red-600', pending: 312, staff: '38 (84%)', note: '3+ staff needed for peak shift' },
  { name: 'Logistics & Shipping', status: 'Optimal', statusColor: 'bg-green-100 text-green-600', pending: 87, staff: '21 (91%)', note: 'On track' },
  { name: 'Quality & Compliance', status: 'Attention Required', statusColor: 'bg-yellow-100 text-yellow-700', pending: 54, staff: '12 (75%)', note: 'Audit deadline approaching' },
];

const alerts = [
  { text: 'Croissant line B: output down 22% — maintenance ticket unassigned' },
  { text: 'Quality audit due Friday — 3 inspection tasks unallocated' },
  { text: 'Overnight shift understaffed by 2 operators for naan line' },
  { text: 'Logistics backlog at 87 orders — avg dispatch delay 34 min' },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeNav, setActiveNav] = useState('Dashboard');

  const handleAssign = async () => {
    setLoading(true);
    setResult(null);
    const response = await fetch('http://localhost:8000/agent/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tasks: [
          { task_id: 'T001', task_name: 'Resolve croissant line B maintenance ticket', required_skill: 'equipment_maintenance', priority: 'high' },
          { task_id: 'T002', task_name: 'Complete Q2 quality inspection for naan production', required_skill: 'quality_control', priority: 'high' },
          { task_id: 'T003', task_name: 'Dispatch overdue logistics orders — batch #4421', required_skill: 'logistics_coordination', priority: 'medium' },
        ],
        teams: [
          { team_name: 'Ops Alpha', specializations: ['equipment_maintenance', 'production_scheduling'], current_load: 1, max_capacity: 5 },
          { team_name: 'Quality Squad', specializations: ['quality_control', 'compliance_audit'], current_load: 0, max_capacity: 4 },
          { team_name: 'Logistics Team', specializations: ['logistics_coordination', 'dispatch'], current_load: 2, max_capacity: 5 },
        ],
      }),
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

 return (
  <div>
    {/* Greeting */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Good Afternoon</h1>
      <p className="text-sm text-gray-500">Workforce Intelligence Dashboard — FGF Brands | Current capacity utilization: <span className="text-indigo-600 font-semibold">87%</span></p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-5 gap-4 mb-6">
      {[
        { label: 'Tasks in Queue', value: '453', sub: '12 task types tracked' },
        { label: 'Completed Today', value: '1,204', sub: '+11% vs yesterday', subColor: 'text-green-500' },
        { label: 'SLA Compliance', value: '93.7%', sub: 'Target: 95%', subColor: 'text-yellow-500' },
        { label: 'Active Staff', value: '71', sub: '87% avg utilization' },
        { label: 'Production Lines', value: '5/7', sub: '2 need attention', subColor: 'text-red-500' },
      ].map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow p-4">
          <div className="text-xs text-gray-400 mb-1">{card.label}</div>
          <div className="text-2xl font-bold text-gray-800">{card.value}</div>
          <div className={`text-xs mt-1 ${card.subColor || 'text-gray-400'}`}>{card.sub}</div>
        </div>
      ))}
    </div>

    {/* Priority Alerts */}
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-semibold">⚠ Priority Alerts</span>
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">4</span>
        </div>
        <button className="text-indigo-600 text-sm hover:underline">View All →</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-center justify-between bg-orange-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-700">🔴 {a.text}</span>
            <button className="text-xs text-indigo-600 font-semibold ml-3 whitespace-nowrap hover:underline">Action</button>
          </div>
        ))}
      </div>
    </div>

    {/* Smart Task Allocation */}
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Smart Task Allocation</h2>
        <button onClick={handleAssign} disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {loading ? 'Assigning...' : 'Run Assignment'}
        </button>
      </div>
      {result && (
        <>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900">
                <th className="text-left p-3">Task</th>
                <th className="text-left p-3">Assigned Team</th>
                <th className="text-left p-3">Score</th>
                <th className="text-left p-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {result.assignments.map((a, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-3 font-medium text-gray-800">{a.task_name}</td>
                  <td className="p-3 text-indigo-600 font-semibold">{a.assigned_team}</td>
                  <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{a.score}</span></td>
                  <td className="p-3 text-gray-500 text-xs">{a.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-[#1a1a2e] text-white rounded-xl p-4">
            <div className="font-semibold mb-2 text-sm">AI Executive Summary</div>
            <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </>
      )}
    </div>

    {/* Insights & Performance */}
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800">Insights & Performance</h2>
          <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">Live</span>
        </div>
        <button className="text-indigo-600 text-sm hover:underline">Full Forecast →</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.name} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-gray-800">{d.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.statusColor}`}>{d.status}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">Pending Tasks: <span className="text-gray-800 font-bold">{d.pending}</span></div>
            <div className="text-xs text-gray-500 mb-1">Staff: <span className="text-gray-800 font-bold">{d.staff}</span></div>
            <div className="text-xs text-gray-400">{d.note}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}