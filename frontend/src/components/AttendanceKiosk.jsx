import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import API from '../api';
import { Camera, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user"
};

export default function AttendanceKiosk() {
  const webcamRef = useRef(null);
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Convert base64 dataURL from webcam into a File object for API upload
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCheckIn = async () => {
    if (!employeeId) {
      setStatus({ type: 'error', message: 'Please enter your Employee ID' });
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setStatus({ type: 'error', message: 'Camera snapshot failed' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const imageFile = dataURLtoFile(imageSrc, 'live_checkin.jpg');
      const formData = new FormData();
      formData.append('image', imageFile);

      // Matches FastAPI: POST /attendance/{employee_id}/check-in
      const response = await API.post(`/attendance/${employeeId}/check-in`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus({
        type: 'success',
        message: `✅ ${response.data.message || 'Check-in successful'} for ${response.data.employee || 'Employee'}!`
      });
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Check-in failed. Try again.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-2">
        <Camera className="w-7 h-7 text-indigo-600" /> AI Attendance Check-In
      </h2>

      {/* Webcam Viewport */}
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-6 border-2 border-indigo-100 shadow-inner">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Inputs & Action Button */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter your Employee ID (e.g. 7)"
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" /> Verifying Face...
            </>
          ) : (
            'Capture & Check-In'
          )}
        </button>

        {/* Status Alert */}
        {status && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 text-sm font-medium ${
              status.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>{status.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}