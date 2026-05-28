'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: "Hi, I'm TaskPulse. Describe your tasks and teams and I'll allocate them for you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const payload = buildPayload(text);
      const res = await fetch('http://localhost:8000/agent/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: 'agent', content: `⚠️ ${data.error}` }]);
      } else {
        const assignmentLines = data.assignments
          .map((a: any) => `• ${a.task_name} → ${a.assigned_team} (score: ${a.score})`)
          .join('\n');
        setMessages((prev) => [
          ...prev,
          { role: 'agent', content: `${assignmentLines}\n\n${data.summary}` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', content: '❌ Could not reach the agent. Is the backend running?' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">TaskPulse Agent</h2>
        <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-semibold">AI</span>
      </div>
      <div className="bg-[#1a1a2e] rounded-xl p-4 h-64 overflow-y-auto mb-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#2a2a45] text-gray-300'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#2a2a45] text-gray-400 rounded-xl px-4 py-2 text-sm animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g. Fix croissant line B maintenance issue..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function buildPayload(text: string) {
  const lower = text.toLowerCase();
  let skill = 'general';
  if (lower.includes('maintenance') || lower.includes('equipment') || lower.includes('line')) skill = 'equipment_maintenance';
  else if (lower.includes('quality') || lower.includes('inspection') || lower.includes('audit') || lower.includes('compliance')) skill = 'quality_control';
  else if (lower.includes('logistics') || lower.includes('dispatch') || lower.includes('shipping') || lower.includes('order') || lower.includes('supply')) skill = 'logistics_coordination';
  else if (lower.includes('shift') || lower.includes('production') || lower.includes('scheduling') || lower.includes('staffing')) skill = 'production_scheduling';
  else if (lower.includes('IT') || lower.includes('system') || lower.includes('network') || lower.includes('infrastructure')) skill = 'IT';

  return {
    tasks: [{ task_id: `t-${Date.now()}`, task_name: text, required_skill: skill, priority: 'medium' }],
    teams: [
      { team_name: 'Operations', specializations: ['equipment_maintenance', 'production_scheduling'], current_load: 1, max_capacity: 5 },
      { team_name: 'Quality Assurance', specializations: ['quality_control', 'compliance_audit'], current_load: 0, max_capacity: 4 },
      { team_name: 'Supply Chain Team', specializations: ['logistics_coordination', 'dispatch'], current_load: 2, max_capacity: 5 },
      { team_name: 'IT Infrastructure', specializations: ['IT', 'systems', 'general'], current_load: 1, max_capacity: 5 },
    ],
  };
}