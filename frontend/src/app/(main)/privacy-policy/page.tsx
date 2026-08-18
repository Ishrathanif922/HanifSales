"use client";

import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Last updated:</strong> January 2025</p>
        <p>At Hanif Sales, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Information We Collect</h2>
        <p>We collect information you provide directly, including your name, email, phone number, shipping address, and payment details when you create an account or make a purchase.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you about your purchases, improve our services, and send promotional materials (with your consent).</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information. Payment data is encrypted and processed securely through Stripe.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at haneefullah922@gmail.com.</p>
      </div>
    </div>
  );
}
