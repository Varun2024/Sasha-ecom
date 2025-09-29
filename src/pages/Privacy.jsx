import React from 'react';
import { ShieldCheck, Info, Mail, Phone, Clock } from 'lucide-react'; // Optional: for icons

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">

            {/* Header */}
            <header className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <ShieldCheck className="h-9 w-9 text-green-600" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                Last Updated: September 27, 2025
              </p>
            </header>

            <div className="space-y-10 text-gray-700 leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                <div className="space-y-4">
                  <p>This Privacy Policy describes how <strong className="font-semibold text-gray-900">SASHA STORE</strong> and its affiliates (collectively "we", "our", "us") collect, use, and process your personal data through our website <a href="https://sashastore.in/" className="text-blue-600 hover:underline font-medium">https://sashastore.in/</a> (the "Platform").</p>
                  <p>By visiting this Platform or providing your information, you expressly agree to be bound by the terms of this Privacy Policy and the <a href="/terms-of-use" className="text-blue-600 hover:underline font-medium">Terms of Use</a>. If you do not agree, please do not use or access our Platform.</p>
                </div>
              </section>

              {/* Data Collection */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <p>We may collect personal data when you register, use our services, or interact with us. This information includes, but is not limited to:</p>
                  <ul className="list-disc list-outside space-y-2 pl-6">
                    <li><strong>Personal Details:</strong> Name, date of birth, address, phone number, email ID.</li>
                    <li><strong>Transactional Data:</strong> Information related to your orders and transactions on the Platform.</li>
                    <li><strong>Sensitive Personal Data:</strong> With your explicit consent, we may collect bank account details, credit/debit card information, or other payment details.</li>
                    <li><strong>Behavioral Information:</strong> We may track your behavior, preferences, and other information you provide to enhance your experience.</li>
                  </ul>
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg text-sm">
                    <p><strong className="font-semibold">Important:</strong> We will never ask for sensitive details like your debit/credit card PIN or net-banking passwords via email or phone. If you receive such a request, please do not share your information and report it to the appropriate authorities.</p>
                  </div>
                </div>
              </section>

              {/* Data Usage */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                <p>We use your personal data to provide the services you request. This includes fulfilling orders, resolving disputes, troubleshooting problems, informing you about offers, customizing your experience, detecting and preventing fraud, and conducting market research.</p>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Sharing Your Information</h2>
                <p>We may share your personal data with our corporate entities, affiliates, and third-party partners (such as sellers, logistics partners, and payment providers) to facilitate services. We may also disclose data to government or law enforcement agencies if required by law or to enforce our Terms of Use and protect the rights and safety of our users.</p>
              </section>
              
              {/* Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Security Precautions</h2>
                <p>We implement reasonable security practices and procedures to protect your data from unauthorized access, loss, or misuse. We offer the use of a secure server for account access. However, data transmission over the internet is not completely secure, and by using the Platform, you accept the inherent security risks.</p>
              </section>

              {/* Data Deletion & Retention */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Deletion & Retention</h2>
                <p>You have the option to delete your account through your profile settings. We retain your personal data only as long as required for the purpose it was collected or as mandated by law. We may retain certain data to prevent fraud, for legal purposes, or in anonymized form for research.</p>
              </section>
              
              {/* Consent */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Rights & Consent</h2>
                <p>By using our Platform, you consent to the collection and processing of your information as described in this policy. You can access and update your data through the Platform. You may withdraw your consent at any time by writing to our Grievance Officer, but please note that this may restrict our ability to provide certain services to you.</p>
              </section>

              {/* Policy Changes */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Changes to this Privacy Policy</h2>
                <p>We may update this policy periodically to reflect changes in our practices. We will notify you of significant changes as required by applicable laws. Please review this policy regularly.</p>
              </section>

              {/* Grievance Officer */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Grievance Officer</h2>
                <div className="mt-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-800 mb-4">For any concerns or to exercise your rights, please contact our Grievance Officer:</p>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Name of the Officer:</strong> <span className="text-gray-500"> Yogesh</span></p>
                    <p><strong>Designation:</strong> <span className="text-gray-500"> Manager</span></p>
                    <p><strong>Company Name & Address:</strong> <span className="text-gray-500"> Sasha Store , Shop No. 10/31 Nagar Nigam complex,NEAR SBI Shankar Nagar,Raipur, Chhattisgarh, 492001 </span></p>
                    <div className="flex items-center gap-3 pt-2">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span><strong>Contact:</strong> <span className="text-gray-500"> 7225801231</span></span>
                    </div>
                     <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span><strong>Available:</strong> Monday - Friday (9:00 AM - 6:00 PM)</span>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;