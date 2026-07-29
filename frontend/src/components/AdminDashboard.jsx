import React, { useEffect, useState } from 'react';
import API from '../api';
import { Users, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_employees: 0, present_today: 0, absent_today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/attendance/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading Management Analytics...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Workforce</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.total_employees || 0}</h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Present Today</p>
            <h3 className="text-3xl font-bold text-emerald-600">{stats.present_today || 0}</h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Absent / Pending</p>
            <h3 className="text-3xl font-bold text-amber-600">
              {(stats.total_employees || 0) - (stats.present_today || 0)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}