import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Header & Hidden Admin Trigger */}
      <div className="mb-10 text-center">
        <img src="/gmark-logo.png" alt="Gmark-Tracking-Field Logo" className="h-28 w-28 mx-auto mb-6 rounded-2xl shadow-lg object-contain bg-white" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Select Your Role
        </h1>
        <p className="text-slate-600">Choose your profile to continue</p>
      </div>

      {/* Role Cards Container */}
      <div className="w-full max-w-md">
        
        <button 
          onClick={() => {
            navigate('/employee-selection');
          }}
          className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-slate-100 transition-all duration-300 transform hover:-translate-y-1 text-left flex flex-col items-center sm:flex-row sm:items-start gap-6 group"
        >
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {/* Employee/User Icon (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Employee</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Access Order Booking and Field Visit Records
            </p>
          </div>
          
          <div className="hidden sm:flex text-slate-300 group-hover:text-blue-600 transition-colors self-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

      </div>
    </div>
  );
}
