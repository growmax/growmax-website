import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Terms of Service | Growmax"
        description="Growmax ARC Terms of Service — terms and conditions for using our cloud-based business management platform."
        path="/terms-of-service"
      />
      
      {/* Header */}
      <section className="pt-16 pb-8 md:pt-24 md:pb-12 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 md:mb-6">
             Legal & Compliance
          </div>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-4 uppercase">
            Terms of Service
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
              These Terms of Service ("Terms") govern your access to and use of the Growmax ARC platform ("Service") provided by Growmax LLC ("Company", "we", "us", or "our"). Please read these Terms carefully before using the Service. — Growmax LLC, USA — hello@growmax.io
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using the Service, you agree to be bound by these Terms and our <Link href="/privacy" className="text-growmax-red">Privacy Policy</Link>. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
            </p>
            <p>
              If you do not agree to these Terms, you must not access or use the Service.
            </p>

            <h2>2. Account Registration</h2>
            <p>
              To use the Service, you must register for an account. By registering, you agree to the following:
            </p>
            <ul>
              <li>Registration requires a valid Google account (Google Sign-In is used for identity verification).</li>
              <li>Each registration creates a workspace (organization) with a unique subdomain.</li>
              <li>You must provide accurate and complete information, including your company name and country.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must notify us immediately at <a href="mailto:hello@growmax.io" className="text-growmax-red">hello@growmax.io</a> if you suspect any unauthorized access to your account.</li>
              <li>You must be at least 16 years of age to use the Service.</li>
            </ul>

            <h2>3. Service Description</h2>
            <p>
              Growmax ARC is a cloud-based business management platform that provides:
            </p>
            <ul>
              <li>Product catalog and inventory management</li>
              <li>Customer and supplier relationship management</li>
              <li>Quote, sales order, and purchase order management</li>
              <li>Invoice generation and payment tracking</li>
              <li>Credit notes, debit notes, and returns processing</li>
              <li>Multi-currency and multi-language support</li>
              <li>Business analytics and reporting</li>
              <li>Team collaboration with role-based access control</li>
              <li>Customer portal for B2B self-service</li>
              <li>AI-powered business insights</li>
            </ul>
            <p>
              The Service is provided as a multi-tenant SaaS platform. Each organization operates within an isolated workspace.
            </p>

            <h2>4. Subscription & Free Trial</h2>
            <ul>
              <li>New accounts may receive a free trial period (typically 14 days). No credit card is required during the trial.</li>
              <li>After the trial period, continued use of the Service requires an active paid subscription.</li>
              <li>Pricing is communicated through the Service interface and/or via email.</li>
              <li>We reserve the right to modify pricing with 30 days' prior written notice.</li>
              <li>All fees are non-refundable except where required by applicable law.</li>
            </ul>

            <h2>5. User Responsibilities</h2>
            <p>
              As a user of the Service, you agree to:
            </p>
            <ul>
              <li>Use the Service only for lawful business purposes.</li>
              <li>Provide accurate business data.</li>
              <li>Maintain the security of your account.</li>
              <li>Not share your credentials with unauthorized parties.</li>
              <li>Not attempt to access other users' data.</li>
              <li>Not use the Service to store or transmit illegal content.</li>
              <li>Not reverse-engineer any part of the Service.</li>
              <li>Not use automated scripts or bots to access the Service.</li>
              <li>Comply with all applicable laws, including export control, data protection, and tax regulations.</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              <strong>Our Property:</strong> The Service, including its source code, design, user interface, documentation, logos, and trademarks, is protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable license to use the Service during the term of your subscription.
            </p>
            <p>
              <strong>Your Data:</strong> You retain full ownership of all data you enter into the Service. We do not claim ownership of your data. We only use your data to provide and improve the Service as described in our <Link href="/privacy" className="text-growmax-red">Privacy Policy</Link>.
            </p>

            <h2>7. Data Portability & Export</h2>
            <ul>
              <li>You may export your data at any time using the built-in export features of the Service.</li>
              <li>Upon termination of your account, your data will remain available for export for 30 days.</li>
              <li>After the 30-day grace period, your data will be permanently deleted. Encrypted backups will be purged within an additional 30 days.</li>
              <li>Contact <a href="mailto:hello@growmax.io" className="text-growmax-red">hello@growmax.io</a> for assistance with data export.</li>
            </ul>

            <h2>8. Service Availability</h2>
            <p>
              We target 99.9% uptime for the Service. This is a goal, not a guarantee. The Service may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled or emergency maintenance</li>
              <li>Software updates and upgrades</li>
              <li>Force majeure events</li>
            </ul>
            <p>
              We will make reasonable efforts to provide advance notice of scheduled maintenance. We are not liable for any loss arising from downtime.
            </p>

            <h2>9. Prohibited Activities</h2>
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul>
              <li>Any illegal activity or fraudulent conduct</li>
              <li>Unauthorized access to the Service or its infrastructure</li>
              <li>Distribution of malware, viruses, or other harmful code</li>
              <li>Distributed denial-of-service (DDoS) attacks</li>
              <li>Reselling the Service without authorization</li>
              <li>Sending spam or unsolicited communications</li>
              <li>Impersonation of any person or entity</li>
              <li>Circumventing security measures or access controls</li>
            </ul>
            <p>
              Violation of these prohibitions may result in immediate suspension or termination of your account.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
            </p>
            <p>
              To the fullest extent permitted by applicable law, Growmax LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to damages for lost profits, revenue, data, or business opportunities.
            </p>
            <p>
              Our total aggregate liability arising out of or relating to these Terms or the Service shall not exceed the total amount paid by you in the preceding 12 months.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such cases, our liability shall be limited to the fullest extent permitted by law.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Growmax LLC, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in connection with:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>Your business data entered into the Service</li>
            </ul>

            <h2>12. Termination</h2>
            <p>
              <strong>By You:</strong> You may cancel your account at any time. Upon cancellation, your data will remain available for export for 30 days.
            </p>
            <p>
              <strong>By Us:</strong> We may suspend or terminate your account for violations of these Terms or non-payment of subscription fees.
            </p>
            <p>
              <strong>For Cause:</strong> We reserve the right to immediately terminate your account for severe violations, including but not limited to illegal activity, security breaches, or abuse of the Service.
            </p>
            <p>
              Sections 6 (Intellectual Property), 10 (Limitation of Liability), 11 (Indemnification), and 14 (Governing Law & Dispute Resolution) shall survive termination of these Terms.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We may modify these Terms from time to time. For material changes, we will provide email notice at least 30 days before the changes take effect.
            </p>
            <p>
              The "Last Updated" date at the top of these Terms reflects the most recent revision. Your continued use of the Service after any changes constitutes your acceptance of the updated Terms.
            </p>

            <h2>14. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States of America, without regard to conflict of law principles.
            </p>
            <p>
              Any dispute arising out of or relating to these Terms shall first be subject to good-faith negotiation for a period of 30 days.
            </p>
            <p>
              If the dispute cannot be resolved through negotiation, it shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall take place in Delaware or remotely, at the parties' discretion.
            </p>
            <p>
              Each party shall bear its own costs and expenses in connection with any dispute.
            </p>
            <p>
              <strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
            </p>

            <h2>15. General Provisions</h2>
            <ul>
              <li><strong>Entire Agreement:</strong> These Terms, together with our <Link href="/privacy" className="text-growmax-red">Privacy Policy</Link>, constitute the entire agreement between you and Growmax LLC regarding the Service.</li>
              <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</li>
              <li><strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</li>
              <li><strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.</li>
              <li><strong>Force Majeure:</strong> We shall not be liable for any failure to perform due to causes beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, or infrastructure failures.</li>
              <li><strong>Notices:</strong> All notices under these Terms shall be sent via email to the address associated with your account.</li>
            </ul>

            <h2>16. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li><strong>Company:</strong> Growmax LLC</li>
              <li><strong>Location:</strong> United States of America</li>
              <li><strong>Email:</strong> <a href="mailto:hello@growmax.io" className="text-growmax-red">hello@growmax.io</a></li>
            </ul>
            <p>
              <Link href="/privacy" className="text-growmax-red">Privacy Policy</Link> · <a href="https://app.growmaxai.com/register" className="text-growmax-red" target="_blank" rel="noopener noreferrer">Create Account</a>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}