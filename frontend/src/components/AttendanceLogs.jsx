import React, { useState, useEffect } from 'react';
import API from '../api';
import { Calendar, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AttendanceLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/attendance/logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to load logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4 border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" /> Live Attendance Audit Logs
          </h2>
          <p className="text-sm text-slate-500">Real-time check-in records & AI verification history</p>
        </div>
        <button
          onClick={fetchLogs}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading audit trail...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
          No attendance logs recorded for today yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b">
              <tr>
                <th className="px-4 py-3">Log ID</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Check-In Time</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5 font-semibold text-slate-800">#{log.id}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    Employee #{log.employee_id}
                  </td>
                  <td className="px-4 py-3.5 flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(log.timestamp || log.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                      AI Face Match
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}