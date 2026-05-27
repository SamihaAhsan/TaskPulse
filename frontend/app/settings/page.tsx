'use client';

const toggles = [
  { label: 'Email alerts', state: 'Enabled' },
  { label: 'Slack notifications', state: 'Enabled' },
  { label: 'Auto assignment', state: 'Disabled' },
  { label: 'Forecast refresh', state: 'Every 30 min' },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Configure alerts, automation, and workspace preferences</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-3">
            {toggles.map((item) => (
              <div key={item.label} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">{item.state}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Workspace</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Workspace name</label>
              <div className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">TaskPulse / ClubOps</div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Environment</label>
              <div className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">Demo</div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Default role</label>
              <div className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">Operations Lead</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#1a1a2e] text-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-2">Automation Summary</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          These settings control how the system sends alerts and how aggressive the automation should be when assigning tasks or flagging staffing gaps.
        </p>
      </div>
    </div>
  );
}
