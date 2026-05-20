import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Growmax',
  description: 'Growmax Enterprise Terms of Service — terms and conditions for using our cloud-based B2B revenue operations platform.',
  alternates: { canonical: 'https://www.growmax.io/terms-of-service' },
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <section className="pt-16 pb-8 md:pt-24 md:pb-12 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 md:mb-6">Legal &amp; Compliance</div>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-4 uppercase">Terms of Service</h1>
          <div className="font-mono text-sm text-growmax-red uppercase tracking-widest">Last Updated: March 2026</div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-growmax-black prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed prose-a:text-growmax-red">
            <p className="font-mono text-xs md:text-sm uppercase bg-gray-50 p-3 md:p-4 border border-gray-200 mb-6 md:mb-8">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Growmax Enterprise platform (&ldquo;Service&rdquo;) provided by Growmax LLC (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Please read these Terms carefully before using the Service. — Growmax LLC, USA — hello@growmax.io
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>By creating an account, accessing, or using the Service, you agree to be bound by these Terms and our <Link href="/privacy">Privacy Policy</Link>. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.</p>
            <p>If you do not agree to these Terms, you must not access or use the Service.</p>

            <h2>2. Account Registration</h2>
            <p>To use the Service, you must register for an account. By registering, you agree to the following:</p>
            <ul>
              <li>Registration requires a valid Google account (Google Sign-In is used for identity verification).</li>
              <li>Each registration creates a workspace (organization) with a unique subdomain.</li>
              <li>You must provide accurate and complete information, including your company name and country.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must notify us immediately at <a href="mailto:hello@growmax.io">hello@growmax.io</a> if you suspect any unauthorized access to your account.</li>
              <li>You must be at least 16 years of age to use the Service.</li>
            </ul>

            <h2>3. Service Description</h2>
            <p>Growmax Enterprise is a cloud-based business management platform that provides:</p>
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
            <p>The Service is provided as a multi-tenant SaaS platform. Each organization operates within an isolated workspace.</p>

            <h2>4. Subscription &amp; Free Trial</h2>
            <ul>
              <li>Growmax Enterprise offers a free trial period to allow you to evaluate the Service.</li>
              <li>After the trial period, continued use requires a paid subscription.</li>
              <li>Subscription fees are billed in advance on a monthly or annual basis.</li>
              <li>All fees are non-refundable unless otherwise stated in writing.</li>
            </ul>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable local, state, national, or international law or regulation</li>
              <li>Transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Attempt to gain unauthorized access to any portion or feature of the Service</li>
              <li>Reverse engineer, decompile, disassemble, or otherwise attempt to extract source code from the Service</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Growmax LLC and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
            <p>You retain full ownership of all data and content you upload to the Service (&ldquo;Customer Data&rdquo;). You grant Growmax LLC a limited, non-exclusive license to process your Customer Data solely to provide the Service.</p>

            <h2>7. Data Privacy &amp; Security</h2>
            <p>Your use of the Service is also governed by our <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference. We implement industry-standard security measures to protect your data.</p>

            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, Growmax LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of (or inability to access or use) the Service.</p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.</p>

            <h2>10. Termination</h2>
            <p>We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Service will immediately cease.</p>

            <h2>11. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>

            <h2>12. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. For material changes, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h2>13. Contact Us</h2>
            <ul>
              <li><strong>Company:</strong> Growmax LLC</li>
              <li><strong>Location:</strong> United States of America</li>
              <li><strong>Email:</strong> <a href="mailto:hello@growmax.io">hello@growmax.io</a></li>
            </ul>
            <p>See also our <Link href="/privacy">Privacy Policy</Link> or <a href="https://app.growmaxai.com/register" target="_blank" rel="noopener noreferrer">Create an Account</a> to get started.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
