import { useState, useEffect } from 'react';
import { createOrderBooking, getProducts } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Select from '../components/Select';

export default function OrderBookings() {
  const navigate = useNavigate();
  
  // Initial state setup to match potential ASP.NET Core DTO structure
  const initialState = {
    employeeId: localStorage.getItem('employeeId') || '',
    assignedBy: localStorage.getItem('employeeName') || '', // newly added field
    route: localStorage.getItem('employeeRoute') || '',
    customerName: '',
    village: '',
    mobileNumber: '',
    customerCategory: '',
    products: [{ productName: '', quantity: 1 }]
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiProducts, setApiProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setApiProducts(data.filter(p => p.isActive));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Hide success message after 5 seconds automatically
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const categoryOptions = [
    { value: 'Dealer', label: 'Dealer' },
    { value: 'Dairy Farmer', label: 'Dairy Farmer' },
    { value: 'VET.Dr', label: 'VET.Dr' },
    { value: 'Medical shop', label: 'Medical shop' },
    { value: 'Institutional', label: 'Institutional' }
  ];

  const productOptions = apiProducts.map(p => ({
    value: p.productName,
    label: p.productName
  }));

  const getUnitPrice = (productName, category) => {
    const product = apiProducts.find(p => p.productName === productName);
    if (!product) return 0;
    if (category === 'Dealer') return product.dealerPrice;
    if (category === 'Dairy Farmer') return product.dairyFarmerPrice;
    return 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    if (showSuccess) setShowSuccess(false);
    if (apiError) setApiError('');
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: null }));
    if (showSuccess) setShowSuccess(false);
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productName: '', quantity: 1 }]
    }));
  };

  const removeProduct = (index) => {
    if (formData.products.length === 1) return; // Must have at least one product
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const calculateGrandTotal = () => {
    return formData.products.reduce((sum, product) => {
      const qty = parseInt(product.quantity) || 0;
      const price = getUnitPrice(product.productName, formData.customerCategory);
      return sum + (qty * price);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.assignedBy.trim()) newErrors.assignedBy = "Employee Name is required";
    if (!formData.route.trim()) newErrors.route = "Route is required";
    if (!formData.customerName.trim()) newErrors.customerName = "Customer Name is required";
    if (!formData.village.trim()) newErrors.village = "Village is required";
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Must be exactly 10 digits";
    }
    if (!formData.customerCategory) newErrors.customerCategory = "Customer Category is required";

    formData.products.forEach((product, index) => {
      if (!product.productName.trim()) newErrors[`productName_${index}`] = "Required";
      if (product.quantity <= 0) newErrors[`quantity_${index}`] = "Invalid qty";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const now = new Date();
      
      const payload = {
        employeeId: parseInt(formData.employeeId, 10),
        assignedBy: formData.assignedBy,
        route: formData.route,
        customerName: formData.customerName,
        village: formData.village,
        mobileNumber: formData.mobileNumber,
        customerCategory: formData.customerCategory,
        products: formData.products.map(p => {
          const qty = parseInt(p.quantity) || 0;
          return {
            productName: p.productName,
            quantity: qty
          };
        }),
        bookingDate: now.toLocaleDateString('en-CA'), // YYYY-MM-DD format
        bookingTime: now.toLocaleTimeString('en-US', { hour12: false }) // HH:mm:ss format
      };

      setIsSubmitting(true);
      setApiError('');
      
      try {
        await createOrderBooking(payload);
        setShowSuccess(true);
        setFormData(initialState);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("API error full details:", err.response || err);
        
        let errorMessage = 'An error occurred while submitting.';
        if (err.response?.data) {
          if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.errors) {
            const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
            errorMessage = `Validation Error: ${validationErrors}`;
          } else if (err.response.data.title) {
            errorMessage = err.response.data.title;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setApiError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setShowSuccess(false);
    setApiError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center mb-8 gap-4">
          <button 
            onClick={() => navigate('/employee-dashboard')}
            className="p-2 bg-white hover:bg-slate-100 shadow-sm border border-slate-200 rounded-full transition-colors active:scale-95"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">New Order Booking</h1>
            <p className="text-sm text-slate-500 mt-1">Fill the details to create an order</p>
          </div>
        </div>

        {/* API Error Message Banner */}
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-red-800">Failed to submit order</h3>
              <p className="text-red-700 text-sm mt-1">{apiError}</p>
            </div>
            <button onClick={() => setApiError('')} className="ml-auto p-1 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Success Message Banner */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-green-800">Order Booking Saved Successfully!</h3>
              <p className="text-green-700 text-sm mt-1">The order has been successfully saved to the server.</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="ml-auto p-1 hover:bg-green-100 rounded-lg text-green-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          
          {/* Customer Details Section */}
          <div className="p-6 md:p-8 border-b border-slate-100 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              Order Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              


              <Input 
                label="Customer Name *" 
                placeholder="Enter full name" 
                value={formData.customerName ?? ''}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                error={errors.customerName}
              />
              <Input 
                label="Mobile Number *" 
                type="tel"
                placeholder="10 digit number" 
                maxLength={10}
                value={formData.mobileNumber ?? ''}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                error={errors.mobileNumber}
              />
              <Select 
                label="Customer Category *" 
                options={categoryOptions}
                value={formData.customerCategory ?? ''}
                onChange={(e) => handleInputChange('customerCategory', e.target.value)}
                error={errors.customerCategory}
              />
              <Input 
                label="Village *" 
                placeholder="Enter village name" 
                value={formData.village ?? ''}
                onChange={(e) => handleInputChange('village', e.target.value)}
                error={errors.village}
              />

            </div>
          </div>

          {/* Products Section */}
          <div className="p-6 md:p-8 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                Products
              </h2>
              <button 
                type="button" 
                onClick={addProduct}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>

            <div className="space-y-5">
              {formData.products.map((product, index) => {
                const currentUnitPrice = getUnitPrice(product.productName, formData.customerCategory);
                const rowTotal = (parseInt(product.quantity) || 0) * currentUnitPrice;
                
                return (
                  <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group transition-shadow hover:shadow-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-5 items-end">
                      
                      {/* 1. Product Name */}
                      <div className="sm:col-span-2 md:col-span-4">
                        <Select 
                          label="Product Name" 
                          options={productOptions}
                          value={product.productName ?? ''}
                          onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                          error={errors[`productName_${index}`]}
                        />
                      </div>
                      
                      {/* 2. Unit Price (Read Only Display) */}
                      <div className="md:col-span-3">
                        <Input 
                          label="Unit Price (₹)" 
                          type="number" 
                          value={currentUnitPrice || ''}
                          readOnly
                        />
                      </div>

                      {/* 3. Quantity */}
                      <div className="md:col-span-2">
                        <Input 
                          label="Quantity" 
                          type="number" 
                          min="1"
                          value={product.quantity ?? ''}
                          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || '')}
                          error={errors[`quantity_${index}`]}
                        />
                      </div>
                      
                      {/* 4. Row Total (Read Only Display) */}
                      <div className="sm:col-span-2 md:col-span-3 pt-2 md:pt-0 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 h-[66px] flex flex-col justify-center">
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Row Total</div>
                        <div className="text-lg font-bold text-slate-800">
                          ₹{rowTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>

                    </div>
                    
                    {formData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 p-2 rounded-full shadow-md transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                        title="Remove product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Calculation */}
            <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
              <div className="bg-white border-2 border-blue-100 shadow-sm rounded-xl px-6 py-4 flex flex-col sm:flex-row items-end sm:items-center justify-between w-full sm:w-auto gap-4 sm:gap-12">
                <span className="text-blue-900 font-bold uppercase tracking-wider text-sm">Grand Total:</span>
                <span className="text-3xl font-extrabold text-blue-600">
                  ₹{calculateGrandTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors w-full sm:w-auto active:scale-95"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all w-full sm:w-auto active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Order
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </form>


      </div>
    </div>
  );
}
