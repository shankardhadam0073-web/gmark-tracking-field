import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getEmployees, 
  getDailyReport,
  getMonthlyReport,
  createEmployee,
  deleteEmployee
} from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');

  // Overview Data states
  const [employees, setEmployees] = useState([]);
  
  // Overview Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reports Data states
  const [dailyReports, setDailyReports] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
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
      setEmployees(data);
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
        setEmployees(data);
      } catch (err) {
        console.error(err);
        alert('Failed to delete employee.');
      }
    }
  };

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch employees. Ensure backend is running.');
      }
    };
    fetchEmployees();
  }, []);



  // Fetch report data on tab change
  useEffect(() => {
    if (activeTab === 'daily') {
      const fetchDaily = async () => {
        setReportLoading(true);
        setReportError('');
        try {
          const data = await getDailyReport();
          setDailyReports(data);
        } catch (err) {
          console.error(err);
          setReportError('Failed to fetch daily reports.');
        } finally {
          setReportLoading(false);
        }
      };
      fetchDaily();
    } else if (activeTab === 'monthly') {
      const fetchMonthly = async () => {
        setReportLoading(true);
        setReportError('');
        try {
          const data = await getMonthlyReport();
          setMonthlyReports(data);
        } catch (err) {
          console.error(err);
          setReportError('Failed to fetch monthly reports.');
        } finally {
          setReportLoading(false);
        }
      };
      fetchMonthly();
    }
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
            onClick={() => navigate('/role-selection')}
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            Switch Role
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
                <input required type="text" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee Code</label>
                <input required type="text" value={newEmployee.employeeCode} onChange={e => setNewEmployee({...newEmployee, employeeCode: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <input required type="text" value={newEmployee.mobileNumber} onChange={e => setNewEmployee({...newEmployee, mobileNumber: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Area</label>
                <input required type="text" value={newEmployee.assignedArea} onChange={e => setNewEmployee({...newEmployee, assignedArea: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
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
