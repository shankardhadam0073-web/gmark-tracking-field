import React from 'react';

export default function Select({ label, options, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select 
        className={`px-4 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-shadow appearance-none ${
          error 
            ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/50' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 hover:border-slate-300'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
          paddingRight: '2.5rem'
        }}
        {...props}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
