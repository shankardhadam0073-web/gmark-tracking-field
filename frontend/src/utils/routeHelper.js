export const resolveTodayRoute = (employeeName = '', employeeId = '') => {
  const kunalRoutes = [
    { code: 'K001', day: 'Wednesday', path: 'Kumbharwada → Bhogavati → Hasur → Shahuwadi → Digawade → Therwad → Mhalunge → Chore → Kote → Vitthalwadi → Koyarwada → Kumbharwada' },
    { code: 'K002', day: 'Thursday', path: 'Kumbharwada → Minche → Kur → Shirgaon → Margoli → Waghapurwadi → Kut → Kenavade → Patane → Mudal → Bidri → Kumbharwada' },
    { code: 'K003', day: 'Friday', path: 'Kumbharwada → Margoli → Yamakar → Kurundwad → Mhasave → Arale → Nendurkarwadi → Shengaon → Kumbharwada' },
    { code: 'K004', day: 'Monday', path: 'Ku. Walwe → Mu. Nitta → Sarawade → Solankur → Digawade → Borbet → Nathawade → Bhangoli → Kapileshwar → Turumb → Mhalunge → Borawade → Bidri → Ku. Walwe' },
    { code: 'K005', day: 'Tuesday', path: 'Ku. Walwe → Chalobachi Wadi → Ma. Sarawade → Panundre → Radhanagari → Ghotawade → Keloshi → Phejiwade → Kaulav → Bha. Harawade → Hirase → Bhanaje → Tarale → Pendurkarwadi → Baradwadi → Talyachi → Yede → Arjunwada ' },
    { code: 'K006', day: 'Saturday', path: 'Ku. Walwe → Margoli → Waghapur → Madilage → Madilage Budruk → Murud → Chimgaon → Gangapur → Solankur → Pimpalwadi → Ku. Walwe' }
  ];

  const pruthvirajRoutes = [
    { code: 'P001', day: 'Monday', path: 'Nesari → Batakanagle → Mahagaon → Hasurvadi → Halkarni → Terani → Mungurvadi → Hebbal Jal → Bidrewadi → Waghrali' },
    { code: 'P002', day: 'Tuesday', path: 'Kolindre → Sule → Umbarwadi → Harli → Bhadgaon → Gadhinglaj' },
    { code: 'P003', day: 'Wednesday', path: 'Inchnal → Gajargaon → Atyal → Karmbali → Aynapur → Bhadwan → Kadgaon → Wadarge → Bahirewadi' },
    { code: 'P004', day: 'Thursday', path: 'Waghrali → Bidrewadi → Hebbal Jal → Shattyahalli → Salamvadi → Modge → Daddi → Kalvikatti' },
    { code: 'P005', day: 'Friday', path: 'Kandeewadi → Kupe → Saroli → Sambre → Kumari → Yamehatti' },
    { code: 'P006', day: 'Saturday', path: 'Gadhinglaj → Dundge → Nul → Nilji → Hebbal → Khandal' }
  ];

  const defaultRoutes = [
    { code: 'R001', day: 'Monday', path: 'Nagpur → Kapsi → Koradi → Kamptee' },
    { code: 'R002', day: 'Tuesday', path: 'Kamptee → Kanhan → Mouda → Ramtek' },
    { code: 'R003', day: 'Wednesday', path: 'Ramtek → Mansar → Deolapar → Khapa' },
    { code: 'R004', day: 'Thursday', path: 'Khapa → Saoner → Kalameshwar → Nagpur' },
    { code: 'R005', day: 'Friday', path: 'Nagpur → Hingna → Wadi → Butibori' },
    { code: 'R006', day: 'Saturday', path: 'Butibori → Umred → Kuhi → Nagpur' }
  ];

  const name = (employeeName || '').toLowerCase();

  if (name.includes('rohit')) {
    const customRouteStr = sessionStorage.getItem('rohitCustomRoute') ||
                           localStorage.getItem('rohitCustomRoute') ||
                           localStorage.getItem(`rohitCustomRoute_${employeeId}`);
    if (customRouteStr) {
      try {
        const parsed = JSON.parse(customRouteStr);
        if (parsed.label || parsed.path) {
          return parsed.label || parsed.path;
        }
      } catch (e) {}
    }
  }

  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayDay = workingDays.includes(currentDayName) ? currentDayName : 'Monday';

  let routes = defaultRoutes;
  if (name.includes('kunal')) routes = kunalRoutes;
  else if (name.includes('pruthviraj') || name.includes('prutivraj')) routes = pruthvirajRoutes;

  const found = routes.find(r => r.day === todayDay) || routes[0];
  return found ? (found.path || found.code) : 'Main Route';
};

export const getActiveRoute = (employeeName = '', employeeId = '') => {
  if (employeeId) {
    const activeRouteEmp = localStorage.getItem(`activeRoute_${employeeId}`);
    if (activeRouteEmp && activeRouteEmp.trim()) {
      return activeRouteEmp.trim();
    }
  }

  const activeRouteGen = localStorage.getItem('employeeRoute');
  if (activeRouteGen && activeRouteGen.trim()) {
    return activeRouteGen.trim();
  }

  return resolveTodayRoute(employeeName, employeeId);
};

export const isTripStarted = (employeeId) => {
  if (!employeeId) return false;
  const status = localStorage.getItem(`tripStatus_${employeeId}`);
  return status === 'Started';
};
