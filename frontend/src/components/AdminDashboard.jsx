import React, { useEffect, useState } from 'react';
import API from '../api';
import EmployeeManager from './EmployeeManager';
import AttendanceLogs from './AttendanceLogs';
import { Users, CheckCircle, AlertTriangle, BarChart3, List, ShieldCheck } from 'lucide-react';

export default function AdminDashboard({ onSelectRegisterFace }) {
  const [activeSubTab, setActiveSubTab] = useState('analytics');
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Sub-Navigation */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 max-w-fit">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'analytics'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>
        <button
          onClick={() => setActiveSubTab('employees')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'employees'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> Employee Roster
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'logs'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <List className="w-4 h-4" /> Audit Logs
        </button>
      </div>

      {/* Analytics Tab */}
      {activeSubTab === 'analytics' && (
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
      )}

      {/* Employees Tab */}
      {activeSubTab === 'employees' && (
        <EmployeeManager onSelectRegisterFace={onSelectRegisterFace} />
      )}

      {/* Audit Logs Tab */}
      {activeSubTab === 'logs' && <AttendanceLogs />}
    </div>
  );
}