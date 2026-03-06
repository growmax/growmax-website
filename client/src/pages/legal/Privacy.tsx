import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Privacy Policy | Growmax"
        description="Growmax privacy policy. Learn how we collect, use, and protect your data."
        path="/privacy"
      />
      
      {/* Header */}
      <section className="pt-16 pb-8 md:pt-24 md:pb-12 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 md:mb-6">
             Legal & Compliance
          </div>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-4 uppercase">
            Privacy Policy
          </h1>
          <div className="font-mono text-sm text-growmax-red uppercase tracking-widest">
            Last Updated: March 2026
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-growmax-black prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed prose-a:text-growmax-red">
            
            <p className="font-mono text-xs md:text-sm uppercase bg-gray-50 p-3 md:p-4 border border-gray-200 mb-6 md:mb-8">
              At Growmax LLC, we are committed to full transparency about how we collect, use, and protect your data. This Privacy Policy explains our practices in clear language — no hidden fine print. — Growmax LLC, USA — hello@growmax.io
            </p>

            <h2>1. Overview</h2>
            <p>
              This Privacy Policy applies to the Growmax ARC platform ("Service"), operated by Growmax LLC, a company registered in the United States of America. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
            <p>
              This policy describes:
            </p>
            <ul>
              <li>What personal and business information we collect</li>
              <li>Why we collect it</li>
              <li>How we use it</li>
              <li>Who we share it with</li>
              <li>Your rights regarding your data</li>
            </ul>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Account & Identity Data</h3>
            <ul>
              <li>Email address</li>
              <li>Password (stored as a salted one-way hash — never in plaintext)</li>
              <li>Full name</li>
              <li>Profile picture (via Google OAuth)</li>
              <li>Role and permissions</li>
            </ul>

            <h3>2.2 Organization & Business Data</h3>
            <ul>
              <li>Company name and subdomain</li>
              <li>Country, currency, timezone, and date format preferences</li>
              <li>Customers, suppliers, and partners records</li>
              <li>Products, categories, brands, SKUs, and inventory</li>
              <li>Quotes, sales orders, purchase orders, invoices, credit notes, debit notes, and payments</li>
              <li>Tax configurations</li>
              <li>Price lists and discount rules</li>
              <li>Reports and analytics data</li>
            </ul>

            <h3>2.3 Authentication & Security Data</h3>
            <ul>
              <li>Session tokens</li>
              <li>Two-factor authentication (2FA) secrets</li>
              <li>One-time passwords (OTPs) — not stored after verification</li>
              <li>Device fingerprint</li>
              <li>Login activity (timestamps, IP addresses, session metadata)</li>
            </ul>

            <h3>2.4 Uploaded Content</h3>
            <ul>
              <li>Company logos and branding assets</li>
              <li>Product images</li>
              <li>Document attachments</li>
            </ul>

            <h3>2.5 Communication Data</h3>
            <ul>
              <li>Chat messages</li>
              <li>Email notification records</li>
              <li>Activity logs</li>
            </ul>

            <h2>3. Google OAuth & Third-Party Authentication</h2>
            <p>
              Growmax ARC supports Google Sign-In for convenient authentication. When you sign in with Google, we receive the following information:
            </p>
            <ul>
              <li>Email address</li>
              <li>Full name</li>
              <li>Profile picture URL</li>
              <li>Google ID token (JWT)</li>
            </ul>
            <p>
              We do <strong>NOT</strong> receive or store your Google password. We do <strong>NOT</strong> access your Google Drive, Gmail, Calendar, or any other Google services. You can revoke Growmax's access at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">Google Account permissions</a>.
            </p>

            <h2>4. Cookies, Local Storage & Browser Data</h2>
            <p>
              We use browser storage mechanisms strictly for functional purposes. Below is a complete summary:
            </p>
            <table className="w-full border border-gray-300 text-sm font-mono my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Storage Type</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Data Stored</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">localStorage</td>
                  <td className="border border-gray-300 px-3 py-2">Access / refresh / session tokens</td>
                  <td className="border border-gray-300 px-3 py-2">Keeping you signed in</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">localStorage</td>
                  <td className="border border-gray-300 px-3 py-2">Device fingerprint</td>
                  <td className="border border-gray-300 px-3 py-2">Trusted device recognition</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">localStorage</td>
                  <td className="border border-gray-300 px-3 py-2">Branding preferences</td>
                  <td className="border border-gray-300 px-3 py-2">Faster page load</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">localStorage</td>
                  <td className="border border-gray-300 px-3 py-2">Session activity timestamps</td>
                  <td className="border border-gray-300 px-3 py-2">Session timeout management</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Cookies</td>
                  <td className="border border-gray-300 px-3 py-2">Session identifiers (httpOnly)</td>
                  <td className="border border-gray-300 px-3 py-2">Secure session management</td>
                </tr>
              </tbody>
            </table>
            <p>
              We do <strong>NOT</strong> use any third-party tracking, advertising, or analytics cookies. All browser storage is strictly functional. You can clear this data by logging out or clearing your browser data.
            </p>

            <h2>5. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and operate the Service</li>
              <li>Authenticate your identity and manage sessions</li>
              <li>Send transactional emails (order confirmations, password resets, etc.)</li>
              <li>Enforce security policies and detect threats</li>
              <li>Personalize your experience within the platform</li>
              <li>Generate reports and business analytics</li>
              <li>Improve and enhance the Service</li>
            </ul>
            <p>
              We do <strong>NOT</strong>:
            </p>
            <ul>
              <li>Sell your data to third parties</li>
              <li>Use your data for advertising or ad targeting</li>
              <li>Train AI or machine learning models on your business data</li>
              <li>Share your data with data brokers</li>
            </ul>

            <h2>6. Third-Party Services</h2>
            <p>
              We integrate with the following third-party services to operate the platform:
            </p>
            <ul>
              <li><strong>Google Identity Services</strong> — Used for authentication (Google Sign-In). See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
              <li><strong>Postmark / ActiveCampaign</strong> — Used for transactional email delivery. See <a href="https://postmarkapp.com/privacy-policy" target="_blank" rel="noopener noreferrer">Postmark's Privacy Policy</a>.</li>
              <li><strong>Cloud Object Storage (S3-compatible)</strong> — Used for file storage (product images, documents, logos).</li>
            </ul>
            <p>
              We do not share your personal or business data with any third party for their independent use.
            </p>

            <h2>7. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul>
              <li>Encryption in transit (TLS/HTTPS on all connections)</li>
              <li>Password hashing with per-user salts</li>
              <li>JWT-based authentication with refresh token rotation</li>
              <li>Two-factor authentication (TOTP)</li>
              <li>Session management with automatic timeouts and device tracking</li>
              <li>Role-based access control (RBAC)</li>
              <li>Multi-tenant data isolation</li>
              <li>Audit logging of critical actions</li>
            </ul>
            <p>
              While no method of electronic transmission or storage is 100% secure, we commit to notifying affected users promptly in the event of a data breach.
            </p>

            <h2>8. Data Retention</h2>
            <ul>
              <li><strong>Account data:</strong> Retained while your account is active. Deleted upon account termination with a 30-day grace period.</li>
              <li><strong>Business data:</strong> Retained while your subscription is active. You may delete individual records at any time.</li>
              <li><strong>Session and authentication logs:</strong> Retained for up to 90 days.</li>
              <li><strong>OTP codes:</strong> Expire and are deleted after use or within 10 minutes.</li>
              <li><strong>Uploaded files:</strong> Retained while the associated record exists.</li>
              <li><strong>Backups:</strong> May persist for up to 30 days beyond deletion.</li>
            </ul>

            <h2>9. Your Rights</h2>
            <p>
              You have the following rights regarding your personal data:
            </p>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your data within 30 days, subject to legal requirements.</li>
              <li><strong>Right to Data Portability:</strong> Request a machine-readable export of your data.</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of non-essential communications. Note that transactional emails (e.g., password resets, order confirmations) cannot be opted out of.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:hello@growmax.io">hello@growmax.io</a>. We will respond within 30 days.
            </p>

            <h2>10. California Residents (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul>
              <li><strong>Right to Know:</strong> You may request details about the categories and specific pieces of personal information we have collected about you.</li>
              <li><strong>Right to Delete:</strong> You may request deletion of your personal information.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
              <li><strong>Right to Opt-Out of Sale:</strong> We do <strong>NOT</strong> sell personal information. There is nothing to opt out of.</li>
            </ul>

            <h2>11. European Residents (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), we process your personal data under the following legal bases:
            </p>
            <ul>
              <li><strong>Consent:</strong> Where you have given explicit consent for specific processing activities.</li>
              <li><strong>Contractual Necessity:</strong> Where processing is necessary to fulfill our contractual obligations to you.</li>
              <li><strong>Legitimate Interest:</strong> Where processing is necessary for our legitimate business interests, provided your rights do not override those interests.</li>
            </ul>
            <p>
              Data transfers to the United States are conducted with appropriate safeguards in place. Our Data Protection Officer (DPO) can be reached at <a href="mailto:hello@growmax.io">hello@growmax.io</a>. You have the right to lodge a complaint with your local data protection authority.
            </p>

            <h2>12. Children's Privacy</h2>
            <p>
              Growmax ARC is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we discover that we have inadvertently collected data from a child under 16, we will delete it promptly.
            </p>

            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. For material changes, we will provide email notice at least 30 days before the changes take effect. The "Last Updated" date at the top of this page reflects the most recent revision.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li><strong>Company:</strong> Growmax LLC</li>
              <li><strong>Location:</strong> United States of America</li>
              <li><strong>Email:</strong> <a href="mailto:hello@growmax.io">hello@growmax.io</a></li>
            </ul>
            <p>
              See also our <Link href="/terms-of-service">Terms of Service</Link> or <a href="https://app.growmaxai.com/register" target="_blank" rel="noopener noreferrer">Create an Account</a> to get started.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}