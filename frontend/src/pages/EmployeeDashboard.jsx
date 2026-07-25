import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEmployeeOrderBookings, getEmployeePendingOrders, getEmployeeDeliveredOrders, getEmployeeCancelledOrders } from '../services/api';
import BottomNav from '../components/BottomNav';
import DesktopSidebar from '../components/DesktopSidebar';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0, cancelled: 0 });

  useEffect(() => {
    const name = localStorage.getItem('employeeName') || localStorage.getItem('rememberedEmployeeName');
    const employeeId = localStorage.getItem('employeeId') || localStorage.getItem('rememberedEmployeeId');
    if (!name || !employeeId) {
      navigate('/welcome');
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

  const handleLogout = () => {
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeRoute');
    localStorage.removeItem('rememberedEmployeeName');
    localStorage.removeItem('rememberedEmployeeId');
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:pl-64 transition-all">
      {/* Desktop Sidebar Navigation (Visible on MD and Desktop) */}
      <DesktopSidebar />

      {/* Header Section (Welcome Banner & Quick Action Buttons side-by-side) */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-8 sm:py-10 px-6 sm:px-10 lg:px-12 rounded-b-[2rem] shadow-lg shadow-blue-900/15">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8 lg:gap-12">
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-200/90 tracking-wide mb-2">{today}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center gap-2">
              Welcome, {employeeName ? employeeName.replace(/\s+Employee$/i, '').trim() : 'Employee'} 👋
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 font-normal mt-2">
              Manage your orders efficiently.
            </p>
          </div>

          {/* Quick Action & Logout Buttons (Right Side of Header) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 lg:gap-5 w-full md:w-auto self-start md:self-end mt-3 md:mt-0">
            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/order-bookings')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg shadow-emerald-950/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 ease-out cursor-pointer border border-white/30 min-h-[48px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/95" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Order</span>
              </button>

              <button
                onClick={() => navigate('/field-visits')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg shadow-indigo-950/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 ease-out cursor-pointer border border-white/30 min-h-[48px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/95" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Field Visit</span>
              </button>
            </div>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>

            {/* Mobile View Compact Modern Logout Button */}
            <div className="flex md:hidden justify-center w-full mt-3">
              <button
                onClick={handleLogout}
                className="w-[48%] max-w-[200px] min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500/90 via-rose-500/90 to-red-600/90 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm tracking-wide rounded-2xl shadow-md shadow-red-900/25 active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer border border-white/20 backdrop-blur-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white/95" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (Statistics & Module Cards sit below Header with clear gap) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 sm:space-y-10">

        {/* Statistics Cards Section */}
        <section className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1: Total Orders */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-lg hover:shadow-2xl active:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-[1.02] active:-translate-y-1.5 active:scale-[1.02] p-5 sm:p-6 md:p-7 text-white flex flex-col justify-center items-center aspect-square text-center relative overflow-hidden group select-none">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 group-active:scale-150 transition-transform duration-500" />
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 sm:mb-3.5 shadow-inner group-hover:scale-110 group-active:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">{stats.total}</p>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase opacity-90 mt-1.5">Total Orders</h3>
            </div>

            {/* Card 2: Pending */}
            <button
              onClick={() => navigate('/pending-orders')}
              className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl shadow-lg hover:shadow-2xl active:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-[1.02] active:-translate-y-1.5 active:scale-[1.02] p-5 sm:p-6 md:p-7 text-white flex flex-col justify-center items-center aspect-square text-center relative overflow-hidden group cursor-pointer select-none"
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 group-active:scale-150 transition-transform duration-500" />
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 sm:mb-3.5 shadow-inner group-hover:scale-110 group-active:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">{stats.pending}</p>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase opacity-90 mt-1.5">Pending</h3>
            </button>

            {/* Card 3: Delivered */}
            <button
              onClick={() => navigate('/delivered-orders')}
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl shadow-lg hover:shadow-2xl active:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-[1.02] active:-translate-y-1.5 active:scale-[1.02] p-5 sm:p-6 md:p-7 text-white flex flex-col justify-center items-center aspect-square text-center relative overflow-hidden group cursor-pointer select-none"
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 group-active:scale-150 transition-transform duration-500" />
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 sm:mb-3.5 shadow-inner group-hover:scale-110 group-active:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">{stats.delivered}</p>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase opacity-90 mt-1.5">Delivered</h3>
            </button>

            {/* Card 4: Cancelled */}
            <button
              onClick={() => navigate('/cancelled-orders')}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-lg hover:shadow-2xl active:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-[1.02] active:-translate-y-1.5 active:scale-[1.02] p-5 sm:p-6 md:p-7 text-white flex flex-col justify-center items-center aspect-square text-center relative overflow-hidden group cursor-pointer select-none"
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 group-active:scale-150 transition-transform duration-500" />
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 sm:mb-3.5 shadow-inner group-hover:scale-110 group-active:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">{stats.cancelled}</p>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase opacity-90 mt-1.5">Cancelled</h3>
            </button>
          </div>
        </section>

        {/* Module Cards Section */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">

            {/* Card 1: Order Bookings */}
            <button
              onClick={() => navigate('/order-bookings')}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl p-7 sm:p-8 lg:p-10 border border-slate-100/90 transition-all duration-300 transform hover:-translate-y-1.5 text-left flex flex-col group active:scale-[0.98]"
            >
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors self-start mb-6 shadow-sm">
                {/* Shopping Cart Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2.5 leading-tight">
                Navbharat Agro Service<br />Order Bookings
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed flex-1">
                Create and manage customer order bookings.
              </p>
              <div className="mt-7 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1.5 transition-transform">
                Open Module
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            {/* Card 2: Field Visit Records */}
            <button
              onClick={() => navigate('/field-visits')}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl p-7 sm:p-8 lg:p-10 border border-slate-100/90 transition-all duration-300 transform hover:-translate-y-1.5 text-left flex flex-col group active:scale-[0.98]"
            >
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors self-start mb-6 shadow-sm">
                {/* Location / Map Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2.5 leading-tight">
                Navbharat Agro Service<br />Field Visit Records
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed flex-1">
                Record customer visits and discussions.
              </p>
              <div className="mt-7 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1.5 transition-transform">
                Open Module
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 pb-24 md:pb-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Navbharat Agro Service
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
