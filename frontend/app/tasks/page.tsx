'use client';
import { useState } from 'react';

const tasks = [
  { id: 'T001', name: 'Resolve croissant line B maintenance ticket', dept: 'Production & Baking', priority: 'High', status: 'Pending', assignee: 'Unassigned' },
  { id: 'T002', name: 'Complete Q2 quality inspection for naan production', dept: 'Quality & Compliance', priority: 'High', status: 'Pending', assignee: 'Unassigned' },
  { id: 'T003', name: 'Dispatch overdue logistics orders — batch #4421', dept: 'Logistics & Shipping', priority: 'Medium', status: 'In Progress', assignee: 'Logistics Team' },
  { id: 'T004', name: 'Restock packaging materials for bagel line', dept: 'Production & Baking', priority: 'Medium', status: 'Pending', assignee: 'Unassigned' },
  { id: 'T005', name: 'Audit overnight shift compliance documentation', dept: 'Quality & Compliance', priority: 'Low', status: 'Completed', assignee: 'Quality Squad' },
  { id: 'T006', name: 'Schedule maintenance for oven unit #3', dept: 'Production & Baking', priority: 'High', status: 'Overdue', assignee: 'Unassigned' },
  { id: 'T007', name: 'Update dispatch routing for GTA North zone', dept: 'Logistics & Shipping', priority: 'Medium', status: 'In Progress', assignee: 'Logistics Team' },
  { id: 'T008', name: 'Train new staff on HACCP procedures', dept: 'Quality & Compliance', priority: 'Low', status: 'Pending', assignee: 'Unassigned' },
];

const priorityColor = { High: 'bg-red-100 text-red-600', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-gray-100 text-gray-500' };
const statusColor = { Pending: 'bg-blue-100 text-blue-600', 'In Progress': 'bg-indigo-100 text-indigo-600', Completed: 'bg-green-100 text-green-600', Overdue: 'bg-red-100 text-red-600' };

export default function TasksHub() {
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Pending', 'In Progress', 'Completed', 'Overdue'];
  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  const stats = [
    { label: 'Total Tasks', value: tasks.length },
    { label: 'High Priority', value: tasks.filter(t => t.priority === 'High').length, color: 'text-red-500' },
    { label: 'Overdue', value: tasks.filter(t => t.status === 'Overdue').length, color: 'text-red-500' },
    { label: 'Completed Today', value: tasks.filter(t => t.status === 'Completed').length, color: 'text-green-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Hub</h1>
        <p className="text-sm text-gray-500">All active tasks across FGF Brands operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4">
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color || 'text-gray-800'}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50 text-indigo-900">
              <th className="text-left p-3">Task ID</th>
              <th className="text-left p-3">Task</th>
              <th className="text-left p-3">Department</th>
              <th className="text-left p-3">Priority</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                <td className="p-3 text-gray-400 font-mono text-xs">{t.id}</td>
                <td className="p-3 font-medium text-gray-800">{t.name}</td>
                <td className="p-3 text-gray-500">{t.dept}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityColor[t.priority]}`}>{t.priority}</span>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[t.status]}`}>{t.status}</span>
                </td>
                <td className="p-3 text-gray-500">{t.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}