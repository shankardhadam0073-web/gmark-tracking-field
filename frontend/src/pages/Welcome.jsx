import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimeout = useRef(null);

  const handleContinue = () => {
    navigate('/role-selection');
  };

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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-slate-100">
        
        {/* Logo Placeholder */}
        <div 
          onClick={handleLogoClick}
          className="bg-blue-600 text-white h-20 w-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-6 shadow-md cursor-pointer select-none active:scale-95 transition-transform"
        >
          NAS
        </div>

        {/* Header Section */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Navbharat Agro Service
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-6">
          Employee Management System
        </h2>

        {/* Welcome Message */}
        <p className="text-slate-600 mb-10 leading-relaxed text-sm md:text-base">
          Welcome to the centralized hub for all your employee management needs. 
          Streamline your workflow, manage attendance, and access your daily tasks securely.
        </p>

        {/* Action Button */}
        <button 
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors text-lg flex justify-center items-center gap-2"
        >
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

      </div>
    </div>
  );
}
