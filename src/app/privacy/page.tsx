import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Nuvaxis AI",
  description: "Privacy Policy for Nuvaxis AI. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Header */}
      <div className="border-b border-white/10 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="url(#ringGradP)" strokeWidth="1.5" strokeDasharray="60 40" strokeLinecap="round" />
              <circle cx="18" cy="18" r="5" fill="url(#coreGradP)" />
              <circle cx="28" cy="8" r="2.5" fill="#3b82f6" opacity="0.9" />
              <circle cx="8" cy="28" r="2.5" fill="#6366f1" opacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
              <defs>
                <linearGradient id="ringGradP" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <radialGradient id="coreGradP" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </radialGradient>
              </defs>
            </svg>
            <span className="text-white font-semibold text-lg tracking-tight">
              Nuvaxis <span className="text-blue-500">AI</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: May 12, 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Nuvaxis AI ("Company," "we," "us," or "our") operates the website{" "}
              <a href="https://nuvaxisai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                nuvaxisai.com
              </a>{" "}
              and related services (collectively, the "Services"). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website or use our Services.
              Please read this policy carefully. If you disagree with its terms, please discontinue use of the
              Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>
                <span className="text-gray-300 font-medium">Personal Identification Information:</span> Name,
                email address, phone number, and business name provided when you contact us or sign up for our
                Services.
              </li>
              <li>
                <span className="text-gray-300 font-medium">Business Information:</span> Industry, niche,
                location, website URL, and social media handles provided during account setup.
              </li>
              <li>
                <span className="text-gray-300 font-medium">Payment Information:</span> Billing details
                processed securely through Stripe. We do not store full card numbers on our servers.
              </li>
              <li>
                <span className="text-gray-300 font-medium">Usage Data:</span> Pages visited, time spent,
                browser type, IP address, and device information collected automatically via cookies and
                analytics tools.
              </li>
              <li>
                <span className="text-gray-300 font-medium">Communications:</span> Messages sent through our
                contact form or email correspondence.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Provide, operate, and maintain our Services</li>
              <li>Process transactions and send related information (receipts, invoices)</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Send administrative information, updates, and marketing communications (with your consent)</li>
              <li>Personalize your experience on our platform</li>
              <li>Analyze usage trends to improve our Services</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. SMS and Phone Communications</h2>
            <p className="mb-3">
              If you provide your phone number and consent to SMS communications, we may send you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Transactional messages (account updates, billing notifications)</li>
              <li>Service-related alerts and notifications</li>
              <li>Promotional messages about Nuvaxis AI offerings (only with explicit opt-in)</li>
            </ul>
            <p className="mt-3">
              Message and data rates may apply. You may opt out of SMS communications at any time by replying
              STOP to any message or contacting us at{" "}
              <a href="mailto:hello@nuvaxisai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                hello@nuvaxisai.com
              </a>
              . For help, reply HELP or contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Sharing Your Information</h2>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share
              information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>
                <span className="text-gray-300 font-medium">Service Providers:</span> Trusted third parties
                who assist in operating our Services (e.g., Stripe for payments, Supabase for data storage,
                Vercel for hosting) under strict confidentiality agreements.
              </li>
              <li>
                <span className="text-gray-300 font-medium">Legal Requirements:</span> When required by law,
                court order, or government authority.
              </li>
              <li>
                <span className="text-gray-300 font-medium">Business Transfers:</span> In connection with a
                merger, acquisition, or sale of assets, subject to confidentiality obligations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is being sent. However, some
              features of the Services may not function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including SSL/TLS
              encryption, secure data storage, and access controls. However, no method of transmission over
              the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to
              provide Services. You may request deletion of your account and associated data at any time by
              contacting us. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Data portability (receive your data in a structured format)</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@nuvaxisai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                hello@nuvaxisai.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Children's Privacy</h2>
            <p>
              Our Services are not directed to individuals under the age of 13. We do not knowingly collect
              personal information from children. If you believe we have inadvertently collected such
              information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by
              posting the updated policy on this page with a revised "Last updated" date. Continued use of
              the Services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contact Us</h2>
            <p className="mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
              <p className="text-white font-semibold text-lg">Nuvaxis AI</p>
              <p>
                Email:{" "}
                <a href="mailto:hello@nuvaxisai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  hello@nuvaxisai.com
                </a>
              </p>
              <p>
                Website:{" "}
                <a href="https://nuvaxisai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  nuvaxisai.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8 px-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© 2026 Nuvaxis AI. All rights reserved.</p>
          <Link href="/" className="hover:text-white transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
