import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getEmployees, createEmployee } from '../services/api';
import Select from '../components/Select';

export default function EmployeeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEmployee, setSelectedEmployee] = useState(location.state?.employeeName || '');
  const [selectedRoute, setSelectedRoute] = useState(location.state?.employeeRoute || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [routeSearch, setRouteSearch] = useState('');

  // Password authentication state removed (moved to EmployeePassword page)

  const employeeOptions = [
    { value: 'Kunal', label: 'Kunal' },
    { value: 'Pruthviraj', label: 'Pruthviraj' },
    { value: 'Rohit', label: 'Rohit' }
  ];

  const kunalRoutes = [
    { code: 'K001', day: 'Wednesday', path: 'Kumbharwada → Bhogavati → Hasur → Shahuwadi → Digawade → Therwad → Mhalunge → Chore → Kote → Vitthalwadi → Koyarwada → Kumbharwada' },
    { code: 'K002', day: 'Thursday', path: 'Kumbharwada → Minche → Kur → Shirgaon → Margoli → Waghapurwadi → Kut → Kenavade → Patane → Mudal → Bidri → Kumbharwada' },
    { code: 'K003', day: 'Friday', path: 'Kumbharwada → Margoli → Yamakar → Kurundwad → Mhasave → Arale → Nendurkarwadi → Shengaon → Kumbharwada' },
    { code: 'K004', day: 'Monday', path: 'Ku. Walwe → Mu. Nitta → Sarawade → Solankur → Digawade → Borbet → Nathawade → Bhangoli → Kapileshwar → Turumb → Mhalunge → Borawade → Bidri → Ku. Walwe' },
    { code: 'K005', day: 'Tuesday', path: 'Ku. Walwe → Chalobachi Wadi → Ma. Sarawade → Panundre → Radhanagari → Ghotawade → Keloshi → Phejiwade → Kaulav → Bha. Harawade → Hirase → Bhanaje → Tarale → Pendurkarwadi → Baradwadi → Talyachi → Yede → Arjunwada → Ku. Walwe' },
    { code: 'K006', day: 'Saturday', path: 'Ku. Walwe → Margoli → Waghapur → Madilage → Madilage Budruk → Murud → Chimgaon → Gangapur → Solankur → Pimpalwadi → Ku. Walwe' }
  ];

  const pruthvirajRoutes = [
    { code: 'P001', day: 'Route 1', path: 'Nesari → Batakanagle → Mahagaon → Hasurvadi → Halkarni → Terani → Mungurvadi → Hebbal Jal → Bidrewadi → Waghrali' },
    { code: 'P002', day: 'Route 2', path: 'Kolindre → Sule → Umbarwadi → Harli → Bhadgaon → Gadhinglaj' },
    { code: 'P003', day: 'Route 3', path: 'Inchnal → Gajargaon → Atyal → Karmbali → Aynapur → Bhadwan → Kadgaon → Wadarge → Bahirewadi' },
    { code: 'P004', day: 'Route 4', path: 'Waghrali → Bidrewadi → Hebbal Jal → Shattyahalli → Salamvadi → Modge → Daddi → Kalvikatti' },
    { code: 'P005', day: 'Route 5', path: 'Kandeewadi → Kupe → Saroli → Sambre → Kumari → Yamehatti' },
    { code: 'P006', day: 'Route 6', path: 'Gadhinglaj → Dundge → Nul → Nilji → Hebbal → Khandal' }
  ];

  const getAvailableRoutes = () => {
    if (selectedEmployee === 'Kunal') return kunalRoutes;
    if (selectedEmployee === 'Pruthviraj') return pruthvirajRoutes;
    return [];
  };

  useEffect(() => {
    // Only reset route if it wasn't pre-filled by state or if it changes after mount
    if (!location.state?.employeeName || selectedEmployee !== location.state?.employeeName) {
      setSelectedRoute('');
    }
    setIsDropdownOpen(false);
    setRouteSearch('');
  }, [selectedEmployee]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.route-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleContinue = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    if (!selectedRoute.trim()) {
      setError('Please enter or select a route');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const employees = await getEmployees();
      let emp = employees.find(e => e.name === selectedEmployee || (e.name && e.name.includes(selectedEmployee)));
      
      let empId = 1;

      if (emp) {
        empId = emp.id;
      } else {
        try {
          const newEmp = await createEmployee({
            name: `${selectedEmployee} Employee`,
            employeeCode: `E${Math.floor(Math.random() * 10000)}`,
            mobileNumber: '0000000000',
            assignedArea: 'HQ'
          });
          empId = newEmp.id || 1;
        } catch (e) {
          console.log("Could not create employee, using fallback ID.", e);
        }
      }

      navigate('/employee-password', {
        state: {
          employeeId: empId,
          employeeName: selectedEmployee,
          employeeRoute: selectedRoute
        }
      });
    } catch (err) {
      console.error(err);
      setError('An error occurred while continuing.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-slate-100">
        
        <img src="/logo.jpg" alt="Gmark-Tracking-Field Logo" className="h-24 w-24 mx-auto mb-6 rounded-2xl shadow-md object-contain bg-white" />

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Welcome
        </h1>
        <p className="text-slate-600 mb-8">Please select your details to continue</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="mb-6">
          <Select
            label="Employee"
            options={employeeOptions}
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          />
        </div>

        {selectedEmployee && selectedEmployee === 'Rohit' ? (
          <div className="mb-8 text-left">
            <label className="block text-sm font-medium text-slate-700 mb-2">Today's Route</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y min-h-[120px] bg-white transition-shadow"
              placeholder="Enter today's route..."
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
            />
          </div>
        ) : selectedEmployee ? (
          <div className="mb-8 text-left relative route-dropdown-container">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Route</label>
            
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center cursor-pointer hover:border-slate-300 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <span className={selectedRoute ? "text-slate-900 font-medium" : "text-slate-500"}>
                {selectedRoute ? `Route ${selectedRoute} Selected` : "Select your route..."}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-96 flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                  <input
                    type="text"
                    placeholder="Search routes..."
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-shadow"
                    value={routeSearch}
                    onChange={(e) => setRouteSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {getAvailableRoutes().filter(r => 
                    r.code.toLowerCase().includes(routeSearch.toLowerCase()) || 
                    r.day.toLowerCase().includes(routeSearch.toLowerCase()) ||
                    r.path.toLowerCase().includes(routeSearch.toLowerCase())
                  ).map((route) => (
                    <div 
                      key={route.code}
                      onClick={() => {
                        setSelectedRoute(route.code);
                        setIsDropdownOpen(false);
                        setRouteSearch('');
                      }}
                      className={`p-3 rounded-xl mb-1 cursor-pointer transition-all ${selectedRoute === route.code ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                    >
                      <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-800">📅 {route.day}</span>
                        <span className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-bold shadow-sm">🆔 {route.code}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed text-left">📍 {route.path}</p>
                    </div>
                  ))}
                  {getAvailableRoutes().filter(r => 
                    r.code.toLowerCase().includes(routeSearch.toLowerCase()) || 
                    r.day.toLowerCase().includes(routeSearch.toLowerCase()) ||
                    r.path.toLowerCase().includes(routeSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No matching routes found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <button 
          onClick={handleContinue}
          disabled={isSubmitting || !selectedEmployee || !selectedRoute}
          className={`w-full py-4 px-6 rounded-xl text-lg font-semibold shadow-md transition-all flex justify-center items-center gap-2 ${
            isSubmitting || !selectedEmployee || !selectedRoute
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
