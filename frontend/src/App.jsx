import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AttendanceKiosk from './components/AttendanceKiosk';
import RegisterFace from './components/RegisterFace';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { LogOut, Shield, Camera, UserCheck, LayoutDashboard } from 'lucide-react';

function Navigation({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <header className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-6 border-slate-200">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Just-In <span className="text-indigo-600">Smart Portal</span>
        </h1>
        <p className="text-slate-500 text-sm">Enterprise AI Workforce Platform</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'checkin' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border'
          }`}
        >
          <Camera className="w-4 h-4" /> Kiosk
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'register' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Register Face
        </button>

        {user && user.role === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
              activeTab === 'admin' ? 'bg-purple-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
        )}

        {!user ? (
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
              activeTab === 'login' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin Login
          </button>
        ) : (
          <button
            onClick={() => {
              logout();
              setActiveTab('login');
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 border border-red-200 transition"
          >
            <LogOut className="w-4 h-4" /> Logout ({user.email.split('@')[0]})
          </button>
        )}
      </div>
    </header>
  );
}

function MainContent() {
  const [activeTab, setActiveTab] = useState('checkin');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'checkin' && <AttendanceKiosk />}
        {activeTab === 'register' && <RegisterFace />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'login' && <Login onLoginSuccess={() => setActiveTab('admin')} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}