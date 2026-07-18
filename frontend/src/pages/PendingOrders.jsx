import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeePendingOrders, deliverOrderBooking } from '../services/api';

export default function PendingOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDeliver = async (orderId) => {
    if (!window.confirm(`Mark order ${orderId} as Delivered?`)) return;
    setError('');
    setSuccess('');
    try {
      await deliverOrderBooking(orderId);
      setSuccess(`Order ${orderId} marked as Delivered successfully!`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      setError('Failed to mark order as delivered.');
    }
  };

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      navigate('/employee-selection');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getEmployeePendingOrders(employeeId);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch pending orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-amber-500 text-white pt-12 pb-20 px-6 rounded-b-3xl shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pending Orders</h1>
            <p className="text-amber-100 font-medium mt-2">View your pending order bookings</p>
          </div>
          <button 
            onClick={() => navigate('/employee-dashboard')}
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors self-start md:self-end"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 -mt-10 mb-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden p-6 md:p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200">
              {success}
            </div>
          )}

          {loading ? (
            <p className="text-slate-500">Loading pending orders...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="p-4 rounded-tl-lg font-semibold">ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Village</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Products</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 rounded-tr-lg font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-slate-500 border-b border-slate-100">
                        No pending orders found.
                      </td>
                    </tr>
                  )}
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-800">{order.id}</td>
                      <td className="p-4 text-slate-600">{order.customerName}</td>
                      <td className="p-4 text-slate-600">{order.village || '-'}</td>
                      <td className="p-4 text-slate-600">{order.bookingDate}</td>
                      <td className="p-4 text-slate-600">
                        {order.products && order.products.length > 0 ? (
                          <ul className="list-disc list-inside text-sm">
                            {order.products.map(p => (
                              <li key={p.id}>{p.quantity}x {p.productName} (₹{p.unitPrice})</li>
                            ))}
                          </ul>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-slate-600 font-medium text-amber-600">₹{order.grandTotal}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeliver(order.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          Mark as Delivered
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
