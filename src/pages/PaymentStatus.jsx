// /* eslint-disable no-unused-vars */

// import React, { useState, useEffect, useContext } from 'react';
// import { useSearchParams, Link, useNavigate, useParams } from 'react-router-dom';
// import { CheckCircle2, XCircle, Loader2, CheckCircle } from 'lucide-react';
// import { doc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import { toast, ToastContainer } from 'react-toastify';

// // Assuming you have these custom hooks
// import { useAuth } from '../context/AuthContext'; // To get the logged-in user
// import { useCart } from '../context/CartContext';   // To dispatch actions like clearing the cart
// import DataContext from '../context/Context';
// const PaymentStatus = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { dispatch } = useCart();
//   const { mode, setMode } = useContext(DataContext);
//   const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failure'
//   const [error, setError] = useState('');
  

//   useEffect(() => {
//     const transactionId = searchParams.get('transactionId');
//     if (!transactionId) {
//       setStatus('failure');
//       setError('No transaction ID found. Invalid URL.');
//       return;
//     }
    
//     // Function to create order documents in Firestore
//     const createOrder = async () => {
//       if (!currentUser) {
//         toast.error("You must be logged in to save order details.");
//         // Even if this fails, the payment is successful, so don't show a failure page.
//         // Redirect them to the home page after a delay.
//         setTimeout(() => navigate('/'), 5000);
//         return;
//       }

//       if (status === 'failure') {
//         return; // Do not create order if payment failed
//       }

//       try {

//         // Retrieve cart and address from localStorage, where CheckoutPage should have saved them
//         const savedCart = JSON.parse(localStorage.getItem('cartForOrder'));
//         const savedAddress = JSON.parse(localStorage.getItem('shippingAddressForOrder'));
//         const totalAmount = savedCart.reduce((total, item) => total + item.sale * item.quantity, 0) + 50; // Ensure shipping is included

//         if (!savedCart || !savedAddress) {
//           throw new Error("Could not retrieve order details from session.");
//         }

//         const orderDetails = {
//           orderId: transactionId,
//           userId: currentUser.user.uid,
//           items: savedCart,
//           shippingAddress: savedAddress,
//           totalAmount: totalAmount,
//           status: 'Confirmed',
//           orderDate: Date.now(), // Use Firestore server timestamp
//         };

//         // // 1. Add order to the 'allOrders' collection
//         // const allOrdersRef = collection(db, 'allOrders');
//         // await addDoc(allOrdersRef, orderDetails);

//         // 2. Add order to the user's personal 'orders' array
//         const userDocRef = doc(db, 'users', currentUser.user.uid);
//         await updateDoc(userDocRef, {
//           orders: arrayUnion(orderDetails)
//         });

//         // 3. Clear the user's cart in context and localStorage
//         dispatch({ type: 'CLEAR' });

//         // 4. Clean up the localStorage
//         localStorage.removeItem('cartForOrder');
//         localStorage.removeItem('shippingAddressForOrder');

//         toast.success("Order details saved successfully!");

//       } catch (err) {
//         console.error("Error creating order:", err);
//         // This is a critical error, notify the user to contact support with their transaction ID
//         setError(`Your payment was successful, but we failed to save your order details. Please contact support with Transaction ID: ${transactionId}`);
//         // Do not set status to 'failure' because the payment succeeded.
//         // The success UI will still show, but with this error message.
//       }
//     };

//     // shipment
//     const createShipment = async (mode) => {
//       if (!currentUser) {
//         toast.error("You must be logged in to create a shipment.");
//         return;
//       }

//       try {
//         const savedAddress = JSON.parse(localStorage.getItem('shippingAddressForOrder'));
//         const shipmentDetails = {
//           address: savedAddress,
//           phone: currentUser.user.phoneNumber || 'N/A',
//           payment_mode: mode,
//           name: currentUser.user.displayName || 'N/A',
//           pin: savedAddress.pin || 'N/A',
//           order_id: transactionId
//         };

//         const response = await fetch('https://localhost:5000/api/create-shipment', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(shipmentDetails),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Shipment creation failed.');
//         }

//         toast.success("Shipment created successfully!");

//       } catch (err) {
//         console.error("Error creating shipment:", err);
//         setError(`Failed to create shipment. Please contact support with Transaction ID: ${transactionId}`);
//       }
//     };

//     const verifyPayment = async () => {
//       try {
//         const response = await fetch(`https://sasha-backend.onrender.com/api/payment-status/?transactionId=${transactionId}`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             transactionId,

//           })
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Payment verification request failed.');
//         }

//         const result = await response.json();
//         console.log('Payment verification result:', result);
//         if (result.success && result.state === 'COMPLETED') {
//           setStatus('success');
//           // Once payment is confirmed, create the order in Firestore
//           await createOrder();
//         } else {
//           setStatus('failure');
//           setError(result.message || 'Payment was not successful. Please try again.');
//         }
//       } catch (err) {
//         setError(err.message || 'An unexpected error occurred while verifying your payment.');
//       }
//     };

//     verifyPayment();
//   }, [searchParams, currentUser, dispatch, navigate]);




//   const StatusDisplay = () => {
//     switch (status) {
//       case 'loading':
//         return (
//           <div className="flex flex-col items-center gap-4">
//             <Loader2 className="w-16 h-16 animate-spin text-purple-500" />
//             <h1 className="text-2xl font-bold ">Verifying Payment...</h1>
//             <p className="text-gray-400">Please wait while we confirm your transaction.</p>
//           </div>
//         );
//       case 'success':
//         return (
//           <div className="flex flex-col items-center gap-4 text-center">
//             <CheckCircle2 className="w-16 h-16 text-green-500" />
//             <h1 className="text-3xl font-bold ">Payment Successful!</h1>
//             <p className="text-gray-400 max-w-md">
//               Thank you for your purchase. Your order has been confirmed.
//             </p>
//             {/* Display the critical error if order creation failed */}
//             {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}
//             <Link
//               to="/orders" // Navigate to a new 'My Orders' page
//               className="mt-4 px-6 py-2 bg-purple-600 font-semibold rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               View My Orders
//             </Link>
//           </div>
//         );
//       case 'failure':
//         return (
//           <div className="flex flex-col items-center gap-4 text-center">
//             <XCircle className="w-16 h-16 text-red-500" />
//             <h1 className="text-3xl font-bold text-gray-600">Payment Failed</h1>
//             <p className="text-gray-400 max-w-md">{error || 'Unfortunately, we were unable to process your payment.'}</p>
//             <Link
//               to="/checkout"
//               className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               Try Again
//             </Link>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen -mt-20">
//       <ToastContainer theme="dark" position="bottom-right" />
//       <div className="p-8 bg-white/5 backdrop-blur-sm shadow-2xl rounded-lg max-w-lg w-full border border-white/10">
//         <StatusDisplay />
//       </div>
//     </div>
//   );
// };

// export default PaymentStatus;



/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { X, Loader2, Check } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext';   
import DataContext from '../context/Context';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { dispatch } = useCart();
  const { mode, setMode } = useContext(DataContext);
  const [status, setStatus] = useState('loading'); 
  const [error, setError] = useState('');

  useEffect(() => {
    const transactionId = searchParams.get('transactionId');
    if (!transactionId) {
      setStatus('failure');
      setError('TRANSACTION ID NOT FOUND');
      return;
    }
    
    const createOrder = async () => {
      if (!currentUser) {
        toast.error("PLEASE LOG IN TO VIEW ORDER DETAILS");
        setTimeout(() => navigate('/'), 5000);
        return;
      }

      if (status === 'failure') return;

      try {
        const savedCart = JSON.parse(localStorage.getItem('cartForOrder'));
        const savedAddress = JSON.parse(localStorage.getItem('shippingAddressForOrder'));
        const totalAmount = savedCart.reduce((total, item) => total + item.sale * item.quantity, 0) + 50;

        if (!savedCart || !savedAddress) {
          throw new Error("ORDER DETAILS EXPIRED");
        }

        const orderDetails = {
          orderId: transactionId,
          userId: currentUser.user.uid,
          items: savedCart,
          shippingAddress: savedAddress,
          totalAmount: totalAmount,
          status: 'Confirmed',
          orderDate: Date.now(),
        };

        const userDocRef = doc(db, 'users', currentUser.user.uid);
        await updateDoc(userDocRef, {
          orders: arrayUnion(orderDetails)
        });

        dispatch({ type: 'CLEAR' });
        localStorage.removeItem('cartForOrder');
        localStorage.removeItem('shippingAddressForOrder');

        toast.success("ORDER CONFIRMED", { theme: "light" });

      } catch (err) {
        console.error("Error creating order:", err);
        setError(`PAYMENT SUCCESSFUL, BUT ORDER SYNC FAILED. PLEASE CONTACT SUPPORT WITH ID: ${transactionId}`);
      }
    };

    const verifyPayment = async () => {
      try {
        const response = await fetch(`https://sasha-backend.onrender.com/api/payment-status/?transactionId=${transactionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId })
        });

        if (!response.ok) throw new Error('VERIFICATION FAILED');

        const result = await response.json();
        if (result.success && result.state === 'COMPLETED') {
          setStatus('success');
          await createOrder();
        } else {
          setStatus('failure');
          setError(result.message || 'PAYMENT UNSUCCESSFUL');
        }
      } catch (err) {
        setError(err.message || 'UNEXPECTED ERROR DURING VERIFICATION');
        setStatus('failure');
      }
    };

    verifyPayment();
  }, [searchParams, currentUser, dispatch, navigate]);

  const StatusDisplay = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-6 py-12">
            <Loader2 className="w-10 h-10 animate-spin text-gray-200" strokeWidth={1} />
            <div className="text-center">
              <h1 className="text-xs tracking-[0.3em] uppercase font-medium text-gray-900 mb-2">Verifying Payment</h1>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-light">Securely processing your transaction</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-8 text-center py-10">
            <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center">
                <Check className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <div>
                <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-gray-900 mb-3">Order Confirmed</h1>
                <p className="text-gray-500 text-[13px] font-light max-w-sm mx-auto leading-relaxed">
                  Thank you for shopping with Sasha Store. Your transaction was successful and your wardrobe is getting an upgrade.
                </p>
            </div>
            
            {error && (
                <div className="bg-gray-50 p-4 border border-gray-100">
                    <p className="text-[10px] text-red-500 tracking-tighter uppercase font-medium">{error}</p>
                </div>
            )}

            <div className="flex flex-col w-full gap-3 pt-4 border-t border-gray-50">
                <Link
                  to="/orders"
                  className="w-full bg-black text-white text-[11px] font-medium tracking-[0.2em] uppercase py-4 hover:bg-gray-800 transition-all"
                >
                  View Order Details
                </Link>
                <Link
                  to="/"
                  className="w-full text-[10px] font-medium tracking-[0.2em] uppercase py-3 text-gray-400 hover:text-black transition-all"
                >
                  Continue Shopping
                </Link>
            </div>
          </div>
        );
      case 'failure':
        return (
          <div className="flex flex-col items-center gap-8 text-center py-10">
            <div className="w-16 h-16 rounded-full border border-red-200 flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" strokeWidth={1.5} />
            </div>
            <div>
                <h1 className="text-xl font-light tracking-[0.2em] uppercase text-gray-900 mb-3">Payment Failed</h1>
                <p className="text-gray-500 text-[13px] font-light max-w-sm mx-auto leading-relaxed uppercase tracking-tighter">
                  {error || 'The transaction could not be completed at this time.'}
                </p>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-black text-white text-[11px] font-medium tracking-[0.2em] uppercase py-4 hover:bg-gray-800 transition-all"
            >
              Back to Checkout
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa] px-4">
      <ToastContainer theme="light" position="bottom-center" />
      <div className="p-10 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 rounded-sm max-w-[450px] w-full">
        <div className="mb-8 text-center">
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-semibold mb-2">Sasha Store</h3>
            <div className="h-[1px] w-8 bg-gray-200 mx-auto"></div>
        </div>
        <StatusDisplay />
      </div>
    </div>
  );
};

export default PaymentStatus;