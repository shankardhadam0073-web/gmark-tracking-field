import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, createEmployee } from '../services/api';
import { resolveTodayRoute } from '../utils/routeHelper';
import Select from '../components/Select';

export default function Welcome() {
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimeout = useRef(null);

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [apiEmployees, setApiEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if a remembered employee already exists on app launch
  useEffect(() => {
    const rememberedName = localStorage.getItem('rememberedEmployeeName') || localStorage.getItem('employeeName');
    const rememberedId = localStorage.getItem('rememberedEmployeeId') || localStorage.getItem('employeeId');
    if (rememberedName && rememberedId) {
      navigate('/employee-password', { replace: true });
    }
  }, [navigate]);

  // Fetch employees from API to populate dropdown (deduplicated by normalized name)
  useEffect(() => {
    getEmployees()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const seen = new Set();
          const uniqueEmps = [];

          for (const e of data) {
            if (!e || !e.name) continue;
            const clean = e.name.replace(/\s+Employee$/i, '').trim();
            const key = clean.toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              uniqueEmps.push({ ...e, cleanName: clean });
            }
          }

          setApiEmployees(uniqueEmps);
          const options = uniqueEmps.map(e => ({
            value: e.cleanName,
            label: e.cleanName
          }));
          setEmployeeOptions(options);
        } else {
          // Default fallback if database empty
          const fallbackOptions = [
            { value: 'Kunal', label: 'Kunal' },
            { value: 'Pruthviraj', label: 'Pruthviraj' },
            { value: 'Rohit', label: 'Rohit' }
          ];
          setEmployeeOptions(fallbackOptions);
        }
      })
      .catch(err => {
        console.log('Error fetching employees, using fallback:', err);
        const fallbackOptions = [
          { value: 'Kunal', label: 'Kunal' },
          { value: 'Pruthviraj', label: 'Pruthviraj' },
          { value: 'Rohit', label: 'Rohit' }
        ];
        setEmployeeOptions(fallbackOptions);
      });
  }, []);

  const handleLogoClick = () => {
    clickCount.current += 1;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      const password = window.prompt('Admin Access: Enter Password');
      if (password === 'admin123') {
        navigate('/admin-dashboard');
      } else if (password !== null) {
        alert('Incorrect password. Access denied.');
      }
    } else {
      clickTimeout.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1000);
    }
  };

  const handleLogin = async () => {
    if (!selectedEmployee) return;

    setIsSubmitting(true);

    try {
      const selNameLower = selectedEmployee.trim().toLowerCase();
      let emp = apiEmployees.find(e => {
        const clean = (e.cleanName || e.name || '').replace(/\s+Employee$/i, '').trim().toLowerCase();
        return clean === selNameLower || clean.includes(selNameLower) || selNameLower.includes(clean);
      });

      let empId = emp ? emp.id : null;

      if (!empId) {
        const employees = await getEmployees().catch(() => []);
        emp = employees.find(e => {
          const clean = (e.name || '').replace(/\s+Employee$/i, '').trim().toLowerCase();
          return clean === selNameLower || clean.includes(selNameLower) || selNameLower.includes(clean);
        });
        if (emp) {
          empId = emp.id;
        } else {
          empId = selNameLower.includes('kunal') ? 1 : (selNameLower.includes('pruthviraj') || selNameLower.includes('prutivraj') ? 2 : 3);
        }
      }

      // Save employee identifier and today's assigned route in localStorage
      const assignedRoute = resolveTodayRoute(selectedEmployee, empId.toString());
      localStorage.setItem('rememberedEmployeeName', selectedEmployee);
      localStorage.setItem('rememberedEmployeeId', empId.toString());
      localStorage.setItem('employeeName', selectedEmployee);
      localStorage.setItem('employeeId', empId.toString());
      localStorage.setItem('employeeRoute', assignedRoute);

      navigate('/employee-password', {
        state: {
          employeeId: empId,
          employeeName: selectedEmployee
        }
      });
    } catch (err) {
      console.error(err);
      const fallbackId = 1;
      const fallbackRoute = resolveTodayRoute(selectedEmployee, fallbackId.toString());
      localStorage.setItem('rememberedEmployeeName', selectedEmployee);
      localStorage.setItem('rememberedEmployeeId', fallbackId.toString());
      localStorage.setItem('employeeName', selectedEmployee);
      localStorage.setItem('employeeId', fallbackId.toString());
      localStorage.setItem('employeeRoute', fallbackRoute);
      navigate('/employee-password', {
        state: {
          employeeId: fallbackId,
          employeeName: selectedEmployee
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-slate-100">

        {/* Company Logo with Hidden Admin Trigger */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer active:scale-95 transition-transform inline-block"
          title="Navbharat Agro Service"
        >
          <img src="/gmark-logo.png" alt="Navbharat Agro Service Logo" className="h-28 w-28 mx-auto mb-6 rounded-2xl shadow-lg object-contain bg-white" />
        </div>

        {/* Header Section */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Navbharat Agro Service
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-6">
          Employee Management System
        </h2>

        {/* Welcome Message */}
        <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-base">
          Welcome to the centralized hub for all your employee management needs.
          Streamline your workflow, manage attendance, and access your daily tasks securely.
        </p>

        {/* Employee Selection Section */}
        <div className="mb-8 text-left">
          <Select
            label="Employee"
            options={employeeOptions}
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          />
        </div>

        {/* Action Button: Login */}
        <button
          onClick={handleLogin}
          disabled={!selectedEmployee || isSubmitting}
          className={`w-full font-semibold py-4 px-6 rounded-xl shadow-md transition-all text-lg flex justify-center items-center gap-2 ${!selectedEmployee || isSubmitting
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-95'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            <>
              Login
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
