import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeDeliveredOrders, getProducts } from '../services/api';

export default function DeliveredOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productsMaster, setProductsMaster] = useState([]);

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      navigate('/employee-selection');
      return;
    }

    const fetchOrders = async () => {
      try {
        const [data, products] = await Promise.all([
          getEmployeeDeliveredOrders(employeeId),
          getProducts().catch(() => [])
        ]);
        setOrders(data);
        setProductsMaster(products);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch delivered orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-emerald-600 text-white pt-12 pb-20 px-6 rounded-b-3xl shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Delivered Orders</h1>
            <p className="text-emerald-100 font-medium mt-2">View your delivered order bookings</p>
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

          {loading ? (
            <p className="text-slate-500">Loading delivered orders...</p>
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
                    <th className="p-4 rounded-tr-lg font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-slate-500 border-b border-slate-100">
                        No delivered orders found.
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
                            {order.products.map(p => {
                              let price = p.unitPrice;
                              if (!price || price === 0) {
                                const mp = productsMaster.find(m => m.productName?.trim().toLowerCase() === p.productName?.trim().toLowerCase());
                                if (mp) {
                                  price = order.customerCategory?.toLowerCase() === 'dairy farmer' ? mp.dairyFarmerPrice : mp.dealerPrice;
                                  if (!price || price === 0) price = Math.max(mp.dealerPrice || 0, mp.dairyFarmerPrice || 0);
                                }
                              }
                              return (
                                <li key={p.id}>{p.quantity}x {p.productName} (₹{price})</li>
                              );
                            })}
                          </ul>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-slate-600 font-medium text-emerald-600">
                        ₹{order.grandTotal > 0 ? order.grandTotal : (order.products?.reduce((sum, p) => {
                          let price = p.unitPrice;
                          if (!price || price === 0) {
                            const mp = productsMaster.find(m => m.productName?.trim().toLowerCase() === p.productName?.trim().toLowerCase());
                            if (mp) {
                              price = order.customerCategory?.toLowerCase() === 'dairy farmer' ? mp.dairyFarmerPrice : mp.dealerPrice;
                              if (!price || price === 0) price = Math.max(mp.dealerPrice || 0, mp.dairyFarmerPrice || 0);
                            }
                          }
                          return sum + (p.quantity * price);
                        }, 0) || 0)}
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
