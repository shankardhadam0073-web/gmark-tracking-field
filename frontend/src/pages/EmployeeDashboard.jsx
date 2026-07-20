import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEmployeeOrderBookings, getEmployeePendingOrders, getEmployeeDeliveredOrders, getEmployeeCancelledOrders } from '../services/api';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0, cancelled: 0 });

  useEffect(() => {
    const name = localStorage.getItem('employeeName');
    const employeeId = localStorage.getItem('employeeId');
    if (!name || !employeeId) {
      navigate('/employee-selection');
    } else {
      setEmployeeName(name);
      
      const fetchStats = async () => {
        try {
          const [total, pending, delivered, cancelled] = await Promise.all([
            getEmployeeOrderBookings(employeeId),
            getEmployeePendingOrders(employeeId),
            getEmployeeDeliveredOrders(employeeId),
            getEmployeeCancelledOrders(employeeId)
          ]);
          setStats({
            total: total.length,
            pending: pending.length,
            delivered: delivered.length,
            cancelled: cancelled.length
          });
        } catch (err) {
          console.error("Failed to fetch stats", err);
        }
      };
      fetchStats();
    }
  }, [navigate]);
  
  // Format today's date
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Header Section */}
      <header className="bg-blue-600 text-white pt-12 pb-20 px-6 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <p className="text-blue-100 font-medium mb-1">{today}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome, {employeeName || 'Employee'}
            </h1>
          </div>
          
          <button 
            onClick={() => {
              localStorage.removeItem('employeeName');
              localStorage.removeItem('employeeRoute');
              localStorage.removeItem('employeeId');
              navigate('/employee-selection');
            }}
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors self-start md:self-end"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content (Cards) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 -mt-10 mb-12 relative z-10">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-600 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center items-center">
            <h3 className="text-lg font-medium text-blue-100 mb-1">Total Orders</h3>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>
          
          <button onClick={() => navigate('/pending-orders')} className="bg-amber-500 hover:bg-amber-600 transition-colors rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center items-center group active:scale-95">
            <h3 className="text-lg font-medium text-amber-100 mb-1 group-hover:text-white transition-colors">Pending</h3>
            <p className="text-4xl font-bold">{stats.pending}</p>
          </button>

          <button onClick={() => navigate('/delivered-orders')} className="bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center items-center group active:scale-95">
            <h3 className="text-lg font-medium text-emerald-100 mb-1 group-hover:text-white transition-colors">Delivered</h3>
            <p className="text-4xl font-bold">{stats.delivered}</p>
          </button>

          <button onClick={() => navigate('/cancelled-orders')} className="bg-red-500 hover:bg-red-600 transition-colors rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center items-center group active:scale-95">
            <h3 className="text-lg font-medium text-red-100 mb-1 group-hover:text-white transition-colors">Cancelled</h3>
            <p className="text-4xl font-bold">{stats.cancelled}</p>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Order Bookings */}
          <button 
            onClick={() => navigate('/order-bookings')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-slate-100 transition-all duration-300 transform hover:-translate-y-1 text-left flex flex-col group active:scale-95"
          >
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors self-start mb-6">
              {/* Shopping Cart Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
              Navbharat Agro Service<br/>Order Bookings
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed flex-1">
              Create and manage customer order bookings.
            </p>
            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Open Module
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Card 2: Field Visit Records */}
          <button 
            onClick={() => navigate('/field-visits')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-slate-100 transition-all duration-300 transform hover:-translate-y-1 text-left flex flex-col group active:scale-95"
          >
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors self-start mb-6">
              {/* Location / Map Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
              Navbharat Agro Service<br/>Field Visit Records
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed flex-1">
              Record customer visits and discussions.
            </p>
            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Open Module
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Navbharat Agro Service
      </footer>

    </div>
  );
}
