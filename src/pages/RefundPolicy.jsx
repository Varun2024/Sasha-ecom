import React from 'react';
import { RotateCcw, PackageCheck, XCircle, Clock } from 'lucide-react'; // Optional: for icons

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">

            {/* Header */}
            <header className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <RotateCcw className="h-9 w-9 text-indigo-600" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Refund, Cancellation & Return Policy
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                Last Updated: September 27, 2025
              </p>
            </header>

            <div className="space-y-12">

              {/* Cancellation Policy Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancellation Policy</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>The following conditions apply to all order cancellations:</p>
                  <ul className="list-disc list-outside space-y-3 pl-6">
                    <li>
                      Cancellation requests will only be considered if made within <strong className="font-semibold text-gray-900">10 days</strong> of placing the order.
                    </li>
                    <li>
                      A request may not be approved if the order has been dispatched or is out for delivery. In such cases, you may choose to reject the product at your doorstep.
                    </li>
                    <li>
                      <strong className="font-semibold text-gray-900">Damaged or Defective Items:</strong> Please report any damaged or defective items to our customer service team within <strong className="font-semibold text-gray-900">10 days</strong> of receipt. The request will be processed after verification by the seller.
                    </li>
                    <li>
                      <strong className="font-semibold text-gray-900">Product Not as Expected:</strong> If you feel the product is not as shown on the site, you must notify customer service within <strong className="font-semibold text-gray-900">10 days</strong> of receiving it. Our team will review your complaint and take an appropriate decision.
                    </li>
                     <li>
                      <strong className="font-semibold text-gray-900">Manufacturer Warranty:</strong> For products that come with a manufacturer's warranty, please address any issues directly with the manufacturer.
                    </li>
                  </ul>
                  {/* <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <div className="flex items-start">
                      <XCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-red-900">Non-Cancellable Items</h3>
                        <p className="mt-1 text-red-800">
                          Cancellation requests for perishable items (e.g., flowers, eatables) are not accepted. However, a refund or replacement may be possible if you can establish that the product quality was not satisfactory upon delivery.
                        </p>
                      </div>
                    </div>
                  </div> */}
                   <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-blue-900">Refund Processing Time</h3>
                        <p className="mt-1 text-blue-800">
                          For any refunds approved by SASHA STORE, it will take approximately <strong className="font-semibold">10 days</strong> for the refund to be processed and credited to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Return Policy Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Return & Exchange Policy</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We offer a refund or exchange within the first <strong className="font-semibold text-gray-900">7 days</strong> of your purchase. If 7 days have passed since your purchase, you will not be offered a return, exchange, or refund.
                  </p>
                  
                  <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <div className="flex items-start">
                      <PackageCheck className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-green-900">Eligibility for a Return/Exchange</h3>
                        <p className="mt-1 text-green-800">
                          To be eligible, the following conditions must be met:
                        </p>
                         <ul className="list-disc list-outside space-y-1 pl-5 mt-2">
                           <li>The item must be unused and in the same condition you received it.</li>
                           <li>The item must be in its original packaging.</li>
                           <li>Items purchased on sale may not be eligible for return or exchange.</li>
                           <li>Some product categories may be exempt from returns; this will be indicated at the time of purchase.</li>
                         </ul>
                      </div>
                    </div>
                  </div>

                  <p>
                    Once your returned item is received and inspected, we will send you an email to notify you of its receipt. If your return is approved after a quality check, your refund or exchange will be delivered in 5-10 days.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;