import React, { useState } from 'react';
import AttendanceKiosk from './components/AttendanceKiosk';
import RegisterFace from './components/RegisterFace';

function App() {
  const [activeTab, setActiveTab] = useState('checkin');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Just-In <span className="text-indigo-600">Smart Portal</span>
        </h1>
        <p className="text-slate-600 mt-2">Real-Time Facial Recognition Attendance System</p>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-5 py-2.5 rounded-lg font-semibold transition ${
              activeTab === 'checkin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📸 Check-In Kiosk
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-5 py-2.5 rounded-lg font-semibold transition ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            👤 Enroll Face (Webcam)
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'checkin' ? <AttendanceKiosk /> : <RegisterFace />}
      </main>
    </div>
  );
}

export default App;