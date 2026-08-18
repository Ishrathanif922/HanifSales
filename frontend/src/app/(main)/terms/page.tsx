"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Last updated:</strong> January 2025</p>
        <p>Welcome to Hanif Sales. By using our website and services, you agree to these Terms and Conditions.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Account Terms</h2>
        <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Orders & Payments</h2>
        <p>All orders are subject to product availability. We reserve the right to cancel orders at our discretion. Prices are subject to change without notice.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Intellectual Property</h2>
        <p>All content on this website, including text, images, logos, and trademarks, is the property of Hanif Sales and is protected by copyright laws.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Limitation of Liability</h2>
        <p>Hanif Sales shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
      </div>
    </div>
  );
}
