'use client';

const forecastRows = [
  { horizon: 'Next 24h', demand: 92, capacity: 87, gap: 5, risk: 'Medium', riskColor: 'bg-yellow-100 text-yellow-700' },
  { horizon: 'Next 3 days', demand: 105, capacity: 92, gap: 13, risk: 'High', riskColor: 'bg-red-100 text-red-600' },
  { horizon: 'Next 7 days', demand: 98, capacity: 96, gap: 2, risk: 'Low', riskColor: 'bg-green-100 text-green-600' },
];

const drivers = [
  'Promotions increasing bakery order volume',
  'Weekend logistics demand spike',
  'Quality audits adding inspection workload',
  'Expected lower staffing on overnight shifts',
];

export default function DemandForecasting() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Demand Forecasting</h1>
        <p className="text-sm text-gray-500">Projected workload vs available capacity over the next few days</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Projected Demand', value: '105%' },
          { label: 'Available Capacity', value: '92%' },
          { label: 'Risk Level', value: 'High', color: 'text-red-500' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4">
            <div className="text-xs text-gray-400 mb-1">{card.label}</div>
            <div className={`text-2xl font-bold ${card.color || 'text-gray-800'}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Forecast Overview</h2>
          <button className="text-indigo-600 text-sm hover:underline">Refresh Forecast →</button>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900">
                <th className="text-left p-3">Horizon</th>
                <th className="text-left p-3">Demand</th>
                <th className="text-left p-3">Capacity</th>
                <th className="text-left p-3">Gap</th>
                <th className="text-left p-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {forecastRows.map((row, i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50'}`}>
                  <td className="p-3 font-medium text-gray-800">{row.horizon}</td>
                  <td className="p-3 text-gray-700">{row.demand}%</td>
                  <td className="p-3 text-gray-700">{row.capacity}%</td>
                  <td className="p-3 text-gray-700">{row.gap}%</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${row.riskColor}`}>{row.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Demand Drivers</h2>
          <div className="space-y-3">
            {drivers.map((d, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700">{d}</div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a2e] text-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-3">Planning Note</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Forecasted demand is trending above current capacity in the near term. The system should recommend added coverage for the highest-risk shift windows and flag where staffing needs are likely to exceed target.
          </p>
        </div>
      </div>
    </div>
  );
}
