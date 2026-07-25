import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getEmployees,
  getDailyReport,
  getMonthlyReport,
  createEmployee,
  deleteEmployee,
  getCancelledOrders,
  deleteOrderBooking
} from '../services/api';

export default function AdminDashboard({ initialTab }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab || 'overview');

  // Overview Data states
  const [employees, setEmployees] = useState([]);

  // Overview Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reports Data states
  const [dailyReports, setDailyReports] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  // Add Employee Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', employeeCode: '', mobileNumber: '', assignedArea: '' });

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const id = Math.floor(Math.random() * 1000000);
      await createEmployee({ id, ...newEmployee });
      setShowAddModal(false);
      setNewEmployee({ name: '', employeeCode: '', mobileNumber: '', assignedArea: '' });
      // Refresh employees
      const data = await getEmployees();
      setEmployees(dedupeEmployees(data));
    } catch (err) {
      console.error(err);
      alert('Failed to add employee. Maybe Employee Code already exists.');
    }
  };

  const handleDeleteEmployee = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        const data = await getEmployees();
        setEmployees(dedupeEmployees(data));
      } catch (err) {
        console.error(err);
        alert('Failed to delete employee.');
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this cancelled order?")) {
      try {
        await deleteOrderBooking(orderId);
        setCancelledOrders(cancelledOrders.filter(o => o.id !== orderId));
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order.");
      }
    }
  };

  const dedupeEmployees = (dataList) => {
    if (!Array.isArray(dataList)) return [];
    const seen = new Set();
    const uniqueList = [];
    for (const emp of dataList) {
      if (!emp || !emp.name) continue;
      const cleanName = emp.name.replace(/\s+Employee$/i, '').trim();
      const key = cleanName.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueList.push({
          ...emp,
          name: cleanName
        });
      }
    }
    return uniqueList;
  };

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(dedupeEmployees(data));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch employees. Ensure backend is running.');
      }
    };
    fetchEmployees();
  }, []);



  // Fetch report data on tab change and periodically every 5 seconds for instant admin updates
  useEffect(() => {
    const fetchTabContent = async () => {
      if (activeTab === 'overview') {
        try {
          const data = await getEmployees();
          setEmployees(dedupeEmployees(data));
        } catch (err) {
          console.error(err);
        }
      } else if (activeTab === 'daily') {
        try {
          const data = await getDailyReport();
          setDailyReports(data);
        } catch (err) {
          console.error(err);
          setReportError('Failed to fetch daily reports.');
        }
      } else if (activeTab === 'monthly') {
        try {
          const data = await getMonthlyReport();
          setMonthlyReports(data);
        } catch (err) {
          console.error(err);
          setReportError('Failed to fetch monthly reports.');
        }
      } else if (activeTab === 'cancelled') {
        try {
          const data = await getCancelledOrders();
          setCancelledOrders(data);
        } catch (err) {
          console.error(err);
          setReportError('Failed to fetch cancelled orders.');
        }
      }
    };

    fetchTabContent();
    const interval = setInterval(fetchTabContent, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-blue-600 text-white pt-12 pb-20 px-6 rounded-b-3xl shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-blue-100 font-medium mt-2">Monitor Employee Performance</p>
          </div>
          <button
            onClick={() => navigate('/welcome')}
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            Back to Welcome
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 -mt-10 mb-12 relative z-10">

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-8 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'overview' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'daily' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Daily Report
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'monthly' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Monthly Report
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'cancelled' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Cancelled Orders
          </button>
          <button
            onClick={() => setActiveTab('employee-status')}
            className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'employee-status' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Employee Status
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
            {/* Employees Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Select Employee</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Employee
                </button>
              </div>

              {employees.length === 0 && !error && <p className="text-slate-500">Loading employees...</p>}
              {error && <p className="text-red-500">{error}</p>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {employees.map(emp => (
                  <div
                    key={emp.id}
                    className="p-6 rounded-2xl shadow border text-left transition-all duration-300 bg-white text-slate-800 border-slate-200 flex justify-between items-center hover:border-blue-300 hover:shadow-lg"
                  >
                    <button
                      onClick={() => navigate(`/admin-dashboard/employee/${emp.id}`)}
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-blue-100 text-blue-600">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg hover:text-blue-600 transition-colors">{emp.name}</h3>
                        <p className="text-sm text-slate-500">
                          Code: {emp.employeeCode}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => handleDeleteEmployee(e, emp.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Employee"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Employee Trip Status Table */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🚀 Today's Employee Trip Status</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Route</th>
                        <th className="py-3 px-4">Trip Status</th>
                        <th className="py-3 px-4">Start Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map(emp => {
                        const empNameClean = emp.name.replace(/\s+Employee$/i, '').trim();
                        const localStatus = localStorage.getItem(`tripStatus_${emp.id}`);
                        const localTime = localStorage.getItem(`tripStartTime_${emp.id}`);
                        const status = emp.tripStatus && emp.tripStatus !== 'Not Started' ? emp.tripStatus : (localStatus || 'Not Started');
                        const rawTime = emp.tripStartTime || localTime;
                        const formattedTime = rawTime
                          ? (typeof rawTime === 'string' && (rawTime.includes('AM') || rawTime.includes('PM'))
                              ? rawTime
                              : new Date(rawTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
                          : '--';
                        const isStarted = status === 'Started';

                        // Resolve route for display (e.g. Rohit's manual route or assigned route)
                        let routeDisplay = emp.selectedRouteCode || '--';
                        if (empNameClean.toLowerCase().includes('rohit')) {
                          const rohitRouteStr = localStorage.getItem('rohitCustomRoute') || localStorage.getItem(`rohitCustomRoute_${emp.id}`);
                          if (rohitRouteStr) {
                            try {
                              const parsed = JSON.parse(rohitRouteStr);
                              routeDisplay = parsed.label || `${parsed.startLoc} → ${parsed.endLoc}`;
                            } catch (e) {
                              routeDisplay = emp.selectedRouteCode || '--';
                            }
                          }
                        } else if (empNameClean.toLowerCase().includes('kunal')) {
                          routeDisplay = emp.selectedRouteCode || 'Kumbharwada → Bidri';
                        } else if (empNameClean.toLowerCase().includes('pruthviraj') || empNameClean.toLowerCase().includes('prutivraj')) {
                          routeDisplay = emp.selectedRouteCode || 'Nesari → Waghrali';
                        }

                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                                {emp.name.charAt(0)}
                              </div>
                              {empNameClean}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-blue-600">
                              📍 {routeDisplay}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                isStarted
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isStarted ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                                {isStarted ? 'Started' : 'Not Started'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              {isStarted ? formattedTime : '--'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Daily Report Tab */}
        {activeTab === 'daily' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Daily Report</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Today
              </span>
            </div>

            {reportError && (
              <div className="m-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                {reportError}
              </div>
            )}

            {reportLoading ? (
              <p className="p-6 text-slate-500">Loading daily report...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600">
                      <th className="p-4 font-semibold">Employee Name</th>
                      <th className="p-4 font-semibold">Total Orders</th>
                      <th className="p-4 font-semibold text-amber-600">Pending</th>
                      <th className="p-4 font-semibold text-emerald-600">Delivered</th>
                      <th className="p-4 font-semibold">Total Sales</th>
                      <th className="p-4 font-semibold">Total Quantity</th>
                      <th className="p-4 font-semibold">Products Sold</th>
                      <th className="p-4 font-semibold">Field Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyReports.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-slate-500 border-b border-slate-100">No report data found.</td>
                      </tr>
                    ) : (
                      dailyReports.map(report => (
                        <tr key={report.employeeId} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-800">{report.employeeName}</td>
                          <td className="p-4 text-slate-600">{report.totalOrders}</td>
                          <td className="p-4 text-amber-600 font-medium">{report.pendingOrders}</td>
                          <td className="p-4 text-emerald-600 font-medium">{report.deliveredOrders}</td>
                          <td className="p-4 text-slate-800 font-bold">₹{report.totalSales}</td>
                          <td className="p-4 text-blue-600 font-medium">{report.totalQuantitySold}</td>
                          <td className="p-4 text-slate-600 text-xs">{report.productsSold}</td>
                          <td className="p-4 text-slate-600">{report.totalFieldVisits}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Monthly Report Tab */}
        {activeTab === 'monthly' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Monthly Report</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                This Month
              </span>
            </div>

            {reportError && (
              <div className="m-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                {reportError}
              </div>
            )}

            {reportLoading ? (
              <p className="p-6 text-slate-500">Loading monthly report...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600">
                      <th className="p-4 font-semibold">Employee Name</th>
                      <th className="p-4 font-semibold">Total Orders</th>
                      <th className="p-4 font-semibold text-amber-600">Pending</th>
                      <th className="p-4 font-semibold text-emerald-600">Delivered</th>
                      <th className="p-4 font-semibold">Total Sales</th>
                      <th className="p-4 font-semibold">Total Quantity</th>
                      <th className="p-4 font-semibold">Products Sold</th>
                      <th className="p-4 font-semibold">Field Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReports.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-slate-500 border-b border-slate-100">No report data found.</td>
                      </tr>
                    ) : (
                      monthlyReports.map(report => (
                        <tr key={report.employeeId} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-800">{report.employeeName}</td>
                          <td className="p-4 text-slate-600">{report.totalOrders}</td>
                          <td className="p-4 text-amber-600 font-medium">{report.pendingOrders}</td>
                          <td className="p-4 text-emerald-600 font-medium">{report.deliveredOrders}</td>
                          <td className="p-4 text-slate-800 font-bold">₹{report.totalSales}</td>
                          <td className="p-4 text-blue-600 font-medium">{report.totalQuantitySold}</td>
                          <td className="p-4 text-slate-600 text-xs">{report.productsSold}</td>
                          <td className="p-4 text-slate-600">{report.totalFieldVisits}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Cancelled Orders Tab */}
        {activeTab === 'cancelled' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Cancelled Orders History</h2>
            </div>

            {reportError && (
              <div className="m-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                {reportError}
              </div>
            )}

            {reportLoading ? (
              <p className="p-6 text-slate-500">Loading cancelled orders...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600">
                      <th className="p-4 font-semibold">ID</th>
                      <th className="p-4 font-semibold">Employee ID</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Village</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Total</th>
                      <th className="p-4 font-semibold text-red-600">Reason</th>
                      <th className="p-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelledOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-4 text-center text-slate-500 border-b border-slate-100">No cancelled orders found.</td>
                      </tr>
                    ) : (
                      cancelledOrders.map(order => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-800">{order.id}</td>
                          <td className="p-4 text-slate-600">{order.employeeId}</td>
                          <td className="p-4 text-slate-600">{order.customerName}</td>
                          <td className="p-4 text-slate-600">{order.village || '-'}</td>
                          <td className="p-4 text-slate-600">{order.bookingDate}</td>
                          <td className="p-4 text-slate-800 font-bold">₹{order.grandTotal > 0 ? order.grandTotal : (order.products?.reduce((sum, p) => sum + (p.rowTotal || (p.quantity * p.unitPrice)), 0) || 0)}</td>
                          <td className="p-4 text-red-600 text-xs max-w-xs break-words">{order.cancellationReason || '-'}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Order"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Employee Status Tab */}
        {activeTab === 'employee-status' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8 text-left">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Employee Status
                </h2>
                <p className="text-xs text-slate-500 mt-1">Real-time status, route details, and trip tracking for all field staff</p>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                Total Staff: {employees.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Employee Name</th>
                    <th className="py-3.5 px-4">Today's Assigned Route</th>
                    <th className="py-3.5 px-4">Trip Status</th>
                    <th className="py-3.5 px-4">Trip Start Time</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4">Last Login Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => {
                    const empNameClean = emp.name.replace(/\s+Employee$/i, '').trim();
                    const localStatus = localStorage.getItem(`tripStatus_${emp.id}`);
                    const localTime = localStorage.getItem(`tripStartTime_${emp.id}`);
                    const status = emp.tripStatus && emp.tripStatus !== 'Not Started' ? emp.tripStatus : (localStatus || 'Not Started');
                    const rawTime = emp.tripStartTime || localTime;
                    const formattedTime = rawTime
                      ? (typeof rawTime === 'string' && (rawTime.includes('AM') || rawTime.includes('PM'))
                          ? rawTime
                          : new Date(rawTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
                      : '--';
                    const isStarted = status === 'Started';

                    // Resolve route for display
                    let routeDisplay = emp.selectedRouteCode || '--';
                    if (empNameClean.toLowerCase().includes('rohit')) {
                      const rohitRouteStr = localStorage.getItem('rohitCustomRoute') || localStorage.getItem(`rohitCustomRoute_${emp.id}`);
                      if (rohitRouteStr) {
                        try {
                          const parsed = JSON.parse(rohitRouteStr);
                          routeDisplay = parsed.label || `${parsed.startLoc} → ${parsed.endLoc}`;
                        } catch (e) {
                          routeDisplay = emp.selectedRouteCode || '--';
                        }
                      }
                    } else if (empNameClean.toLowerCase().includes('kunal')) {
                      routeDisplay = emp.selectedRouteCode || 'Kumbharwada → Bidri';
                    } else if (empNameClean.toLowerCase().includes('pruthviraj') || empNameClean.toLowerCase().includes('prutivraj')) {
                      routeDisplay = emp.selectedRouteCode || 'Nesari → Waghrali';
                    }

                    // Online / Offline Status logic
                    const isOnline = isStarted || (localStorage.getItem('rememberedEmployeeName') || '').toLowerCase().includes(empNameClean.toLowerCase());

                    // Last Login Time logic
                    const lastLogin = localStorage.getItem(`lastLogin_${emp.id}`) || (isStarted ? `Today, ${formattedTime}` : 'Today, 08:30 AM');

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs shadow-xs">
                            {emp.name.charAt(0)}
                          </div>
                          <span>{empNameClean}</span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-blue-600">
                          📍 {routeDisplay}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isStarted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isStarted ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                            {isStarted ? 'Started' : 'Not Started'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {isStarted ? formattedTime : '--'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOnline
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                          {lastLogin}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Add New Employee</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required type="text" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee Code</label>
                <input required type="text" value={newEmployee.employeeCode} onChange={e => setNewEmployee({ ...newEmployee, employeeCode: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <input required type="text" value={newEmployee.mobileNumber} onChange={e => setNewEmployee({ ...newEmployee, mobileNumber: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Area</label>
                <input required type="text" value={newEmployee.assignedArea} onChange={e => setNewEmployee({ ...newEmployee, assignedArea: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
