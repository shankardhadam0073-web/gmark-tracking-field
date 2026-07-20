import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import RoleSelection from './pages/RoleSelection';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeSelection from './pages/EmployeeSelection';
import EmployeePassword from './pages/EmployeePassword';
import PendingOrders from './pages/PendingOrders';
import DeliveredOrders from './pages/DeliveredOrders';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDetail from './pages/EmployeeDetail';
import OrderBookings from './pages/OrderBookings';
import FieldVisits from './pages/FieldVisits';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/employee-selection" element={<EmployeeSelection />} />
        <Route path="/employee-password" element={<EmployeePassword />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route path="/delivered-orders" element={<DeliveredOrders />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/employee/:id" element={<EmployeeDetail />} />
        <Route path="/order-bookings" element={<OrderBookings />} />
        <Route path="/field-visits" element={<FieldVisits />} />
      </Routes>
    </Router>
  );
}

export default App;
