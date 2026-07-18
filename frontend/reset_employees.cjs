const axios = require('axios');
const BASE_URL = 'http://localhost:5159/api';

async function resetEmployees() {
  try {
    const newEmployees = [
      { id: 2, name: 'Prutivraj', employeeCode: 'EMP002', mobileNumber: '1234567891', assignedArea: 'Area 2' },
      { id: 3, name: 'Rohit', employeeCode: 'EMP003', mobileNumber: '1234567892', assignedArea: 'Area 3' }
    ];

    for (const emp of newEmployees) {
      try {
        await axios.post(`${BASE_URL}/employees`, emp);
        console.log(`Added employee: ${emp.name}`);
      } catch (e) {
        console.error(`Failed to add ${emp.name}:`, e.response?.data || e.message);
      }
    }
    console.log('Done!');
  } catch (err) {
    console.error('Error during reset:', err.message);
  }
}

resetEmployees();
