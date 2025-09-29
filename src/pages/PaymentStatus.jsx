/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { CheckCircle2, XCircle, Loader } from 'lucide-react';

// const PaymentStatus = () => {
//   const [searchParams] = useSearchParams();
//   const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failure'
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const transactionId = searchParams.get('transactionId');

//     if (!transactionId) {
//       setStatus('failure');
//       setError('No transaction ID found.');
//       return;
//     }
//     const url = `https://sasha-backend.onrender.com/api/payment-status/?transactionId=${transactionId}`;
//     // const testUrl = `http://localhost:5000/api/payment-status/?transactionId=${transactionId}`;

//     const verifyPayment = async () => {
//       try {
//         const response = await fetch(url, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ transactionId })
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to verify payment.');
//         }

//         const result = await response.json();
//         console.log('Payment verification result:', result);
//         if (result.success && result.state === 'COMPLETED') {
//           setStatus('success');
//         } else {
//           setStatus('failure');
//           setError(result.message || 'Payment was not successful.');
//         }
//       } catch (err) {
//         setStatus('failure');
//         setError(err.message || 'An error occurred while verifying the payment.');
//       }
//     };
//     verifyPayment();
//   }, [searchParams]);

//   const StatusDisplay = () => {
//     switch (status) {
//       case 'loading':
//         return (
//           <div className="flex flex-col items-center gap-4">
//             <Loader className="w-16 h-16 animate-spin text-gray-400" />
//             <h1 className="text-2xl font-bold">Verifying Payment...</h1>
//             <p className="text-gray-500">Please wait while we confirm your transaction.</p>
//           </div>
//         );
//       case 'success':
//         return (
//           <div className="flex flex-col items-center gap-4 text-center">
//             <CheckCircle2 className="w-16 h-16 text-green-500" />
//             <h1 className="text-3xl font-bold">Payment Successful!</h1>
//             <p className="text-gray-500 max-w-md">Thank you for your purchase. Your order has been confirmed and a receipt has been sent to your email.</p>
//             <Link
//               to="/"
//               className="mt-4 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         );
//       case 'failure':
//         return (
//           <div className="flex flex-col items-center gap-4 text-center">
//             <XCircle className="w-16 h-16 text-red-500" />
//             <h1 className="text-3xl font-bold">Payment Failed</h1>
//             <p className="text-gray-500 max-w-md">{error || 'Unfortunately, we were unable to process your payment.'}</p>
//             <Link
//               to="/cart" // Link to your checkout or cart page
//               className="mt-4 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
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
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 -mt-20">
//       <div className="p-8 bg-white shadow-lg rounded-lg max-w-lg w-full">
//         <StatusDisplay />
//       </div>
//     </div>
//   );
// };

// export default PaymentStatus;



import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import {  doc, updateDoc, arrayUnion, collection, addDoc} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';

// Assuming you have these custom hooks
import { useAuth } from '../context/AuthContext'; // To get the logged-in user
import { useCart } from '../context/CartContext';   // To dispatch actions like clearing the cart

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {  dispatch } = useCart();

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failure'
  const [error, setError] = useState('');

  useEffect(() => {
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      setStatus('failure');
      setError('No transaction ID found. Invalid URL.');
      return;
    }

    // Function to create order documents in Firestore
    const createOrder = async () => {
        if (!currentUser) {
            toast.error("You must be logged in to save order details.");
            // Even if this fails, the payment is successful, so don't show a failure page.
            // Redirect them to the home page after a delay.
            setTimeout(() => navigate('/'), 5000);
            return;
        }

        try {
          
            // Retrieve cart and address from localStorage, where CheckoutPage should have saved them
            const savedCart = JSON.parse(localStorage.getItem('cartForOrder'));
            const savedAddress = JSON.parse(localStorage.getItem('shippingAddressForOrder'));
            const totalAmount = savedCart.reduce((total, item) => total + item.sale * item.quantity, 0) + 50; // Ensure shipping is included

            if (!savedCart || !savedAddress) {
                throw new Error("Could not retrieve order details from session.");
            }

            const orderDetails = {
                orderId: transactionId,
                userId: currentUser.user.uid,
                items: savedCart,
                shippingAddress: savedAddress,
                totalAmount: totalAmount,
                status: 'Confirmed',
                orderDate: Date.now(), // Use Firestore server timestamp
            };
            
            // // 1. Add order to the 'allOrders' collection
            // const allOrdersRef = collection(db, 'allOrders');
            // await addDoc(allOrdersRef, orderDetails);

            // 2. Add order to the user's personal 'orders' array
            const userDocRef = doc(db, 'users', currentUser.user.uid);
            await updateDoc(userDocRef, {
                orders: arrayUnion(orderDetails)
            });

            // 3. Clear the user's cart in context and localStorage
            dispatch({ type: 'CLEAR' });

            // 4. Clean up the localStorage
            localStorage.removeItem('cartForOrder');
            localStorage.removeItem('shippingAddressForOrder');

            toast.success("Order details saved successfully!");

        } catch (err) {
            console.error("Error creating order:", err);
            // This is a critical error, notify the user to contact support with their transaction ID
            setError(`Your payment was successful, but we failed to save your order details. Please contact support with Transaction ID: ${transactionId}`);
            // Do not set status to 'failure' because the payment succeeded.
            // The success UI will still show, but with this error message.
        }
    };

    const verifyPayment = async () => {
      try {
        const response = await fetch(`https://sasha-backend.onrender.com/api/payment-status/?transactionId=${transactionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Payment verification request failed.');
        }

        const result = await response.json();
        console.log('Payment verification result:', result);
        if (result.success && result.state === 'COMPLETED') {
          setStatus('success');
          // Once payment is confirmed, create the order in Firestore
          await createOrder();
        } else {
          setStatus('failure');
          setError(result.message || 'Payment was not successful. Please try again.');
        }
      } catch (err) {
        setStatus('failure');
        setError(err.message || 'An unexpected error occurred while verifying your payment.');
      }
    };

    verifyPayment();
  }, [searchParams, currentUser, dispatch, navigate]);


  // IMPORTANT: You must modify your CheckoutPage component to perform this action
  // BEFORE redirecting the user to the payment gateway.
  // Example in your `handleShippingSubmit` function:
  //
  // localStorage.setItem('cartForOrder', JSON.stringify(cart));
  // localStorage.setItem('shippingAddressForOrder', JSON.stringify(selectedAddress));
  // window.location.href = data.redirectUrl; // <-- Then redirect


  const StatusDisplay = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 animate-spin text-purple-500" />
            <h1 className="text-2xl font-bold ">Verifying Payment...</h1>
            <p className="text-gray-400">Please wait while we confirm your transaction.</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h1 className="text-3xl font-bold ">Payment Successful!</h1>
            <p className="text-gray-400 max-w-md">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            {/* Display the critical error if order creation failed */}
            {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}
            <Link
              to="/orders" // Navigate to a new 'My Orders' page
              className="mt-4 px-6 py-2 bg-purple-600 font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              View My Orders
            </Link>
          </div>
        );
      case 'failure':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-600">Payment Failed</h1>
            <p className="text-gray-400 max-w-md">{error || 'Unfortunately, we were unable to process your payment.'}</p>
            <Link
              to="/checkout"
              className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen -mt-20">
        <ToastContainer theme="dark" position="bottom-right" />
        <div className="p-8 bg-white/5 backdrop-blur-sm shadow-2xl rounded-lg max-w-lg w-full border border-white/10">
            <StatusDisplay />
        </div>
    </div>
  );
};

export default PaymentStatus;

