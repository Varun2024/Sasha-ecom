import React from 'react';
import { Truck } from 'lucide-react'; // Optional: for a nice icon

const ShippingPolicy = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Shipping Policy
              </h1>
              <p className="text-gray-500 mt-1">
                Everything you need to know about our delivery process.
              </p>
            </div>
          </div>

          {/* Policy Details */}
          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Shipping Methods
              </h2>
              <p>
                All orders are shipped exclusively through registered domestic courier companies and/or Speed Post. We partner with reliable carriers to ensure your order reaches you safely and on time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Order Processing & Dispatch Time
              </h2>
              <p>
                We are committed to getting your order to you as quickly as possible. Orders are typically shipped and delivered within <span className="font-semibold text-gray-900">7 business days</span> from the date of order placement and successful payment. The dispatch timeline may also be subject to the delivery date agreed upon at the time of order confirmation.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delivery Liability
              </h2>
              <p>
                The final delivery of the shipment is subject to the norms and timelines of the respective courier company or postal authority. While we work diligently to ensure timely dispatch, the Platform Owner shall not be liable for any unforeseen delays in delivery by the courier company or postal authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delivery Address & Confirmation
              </h2>
              <p>
                To ensure a smooth delivery, all orders will be delivered to the shipping address provided by the buyer at the time of purchase. Please ensure your address is accurate and complete. An email confirmation containing delivery details will be sent to the email ID you provided during registration.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Shipping Costs
              </h2>
              <p className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <span className="font-bold">Please Note:</span> Any shipping cost(s) levied by the seller or the Platform Owner are non-refundable.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;