import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react'; // Optional: for icons

const TermsOfUse = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
          <div className="p-8 md:p-12">
            
            {/* Header */}
            <header className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Terms of Use
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                Last Updated: September 27, 2025
              </p>
            </header>

            {/* Introduction Section */}
            <section className="space-y-4 text-sm text-gray-600 mb-8">
              <p>This document is an electronic record under the Information Technology Act, 2000 and does not require any physical or digital signatures. It is published in accordance with Rule 3 (1) of the Information Technology (Intermediaries guidelines) Rules, 2011.</p>
              <p>
                This Platform is owned by <strong className="font-semibold text-gray-800">SASHA STORE</strong>, a company with its registered office at RAIPUR, Chhattisgarh, India (referred to as ‘Platform Owner’, 'we', 'us', 'our').
              </p>
            </section>

            {/* Acceptance of Terms Callout */}
            <div className="my-8 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-900">Important Notice</h3>
                  <p className="mt-1 text-amber-800">
                    Accessing, browsing, or otherwise using the platform indicates your unconditional agreement to all the terms and conditions outlined in this document. <strong className="font-semibold">Please read these Terms of Use carefully before proceeding.</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-10 text-gray-700 leading-relaxed">

              {/* General Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. User Agreement & Services</h2>
                <div className="space-y-4">
                    <p>Your use of the Platform is governed by these <strong className="font-semibold">"Terms of Use"</strong>. By using the Platform, you are contracting with the Platform Owner, and these terms constitute your binding legal obligations.</p>
                    <p>For the purpose of these Terms, wherever the context so requires, <strong className="font-semibold">‘you’</strong>, <strong className="font-semibold">'your'</strong>, or <strong className="font-semibold">‘user’</strong> shall mean any natural or legal person who has agreed to become a user or buyer on the Platform.</p>
                     <p>These Terms can be modified at any time without prior notice. It is your responsibility to review them periodically for updates.</p>
                </div>
              </section>

              {/* Conditions of Use */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Conditions of Use</h2>
                <ul className="list-disc list-outside space-y-4 pl-5">
                  <li>You agree to provide true, accurate, and complete information during registration and are responsible for all acts done through your account.</li>
                  <li>We provide no warranty or guarantee as to the accuracy, timeliness, or suitability of the information and materials on this website. You acknowledge that such information may contain inaccuracies, and we expressly exclude liability to the fullest extent permitted by law.</li>
                  <li>Your use of our Services and the Platform is entirely at your own risk. You are responsible for ensuring that any products, services, or information available meet your specific requirements.</li>
                  <li>The contents of the Platform, including design, layout, and graphics, are proprietary to us. Unauthorized use may lead to legal action.</li>
                  <li>You agree to pay all charges associated with availing the Services.</li>
                  <li>You agree not to use the Platform for any purpose that is unlawful, illegal, or prohibited by these Terms or applicable laws.</li>
                  <li>The Platform may contain links to third-party websites for your convenience. We are not responsible for the content or policies of these external sites.</li>
                  <li>Upon initiating a transaction, you enter into a legally binding and enforceable contract with the Platform Owner.</li>
                </ul>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Indemnification</h2>
                <p>You shall indemnify and hold harmless the Platform Owner, its affiliates, agents, and employees from any claim, demand, or actions (including reasonable attorney's fees) made by any third party due to your breach of these Terms of Use, your violation of any law, or your violation of the rights of a third party.</p>
              </section>

              {/* Force Majeure */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Force Majeure</h2>
                <p>Neither party shall be liable for any failure to perform an obligation if such performance is prevented or delayed by a force majeure event (e.g., acts of God, war, lockdowns, etc.).</p>
              </section>
              
              {/* Governing Law & Jurisdiction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Governing Law & Jurisdiction</h2>
                <ul className="list-disc list-outside space-y-3 pl-5">
                  <li>These Terms shall be governed by and construed in accordance with the laws of India.</li>
                  <li>All disputes arising from these Terms shall be subject to the <strong className="font-semibold">exclusive jurisdiction of the courts in Raipur, Chhattisgarh</strong>.</li>
                </ul>
              </section>

              {/* Communication */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Communication</h2>
                <p>All concerns or communications relating to these Terms must be sent to us using the contact information provided on this website.</p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;