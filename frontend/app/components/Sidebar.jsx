'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Tasks Hub', path: '/tasks' },
  { label: 'Workforce Planner', path: '/workforce' },
  { label: 'Demand Forecasting', path: '/forecasting' },
  { label: 'Shift Tracker', path: '/shift-tracker' },
  { label: 'Reports Hub', path: '/reports' },
  { label: 'Skills Pods', path: '/skills' },
  { label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <aside className="w-52 bg-[#1a1a2e] text-white flex flex-col py-6 px-4 shrink-0">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button key={item.label} onClick={() => router.push(item.path)}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${pathname === item.path ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
