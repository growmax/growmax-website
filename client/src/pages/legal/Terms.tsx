import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Terms of Service | Growmax"
        description="Growmax terms of service and conditions for using our B2B commerce platform."
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
            Last Updated: January 2026
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-growmax-black prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed prose-a:text-growmax-red">
            
            <p className="font-mono text-xs md:text-sm uppercase bg-gray-50 p-3 md:p-4 border border-gray-200 mb-6 md:mb-8">
              These terms of service ("Terms", "Agreement") are an agreement between the website operator ("we", "us" or "our", referring to Webspot Growmax Commerce Private Limited / Growmax LLC) and you ("User", "you" or "your").
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. If you are entering into this Agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this Agreement.
            </p>

            <h2>2. Accounts and Membership</h2>
            <p>
              If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. We may, but have no obligation to, monitor and review new accounts before you may sign in and start using the Services. Providing false contact information of any kind may result in the termination of your account.
            </p>

            <h2>3. Billing and Payments</h2>
            <p>
              You shall pay all fees or charges to your account in accordance with the fees, charges, and billing terms in effect at the time a fee or charge is due and payable. We reserve the right to change products and product pricing at any time. We also reserve the right to refuse any order you place with us.
            </p>

            <h2>4. Accuracy of Information</h2>
            <p>
              Occasionally there may be information on the Website that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, availability, promotions and offers. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information on the Website or on any related Service is inaccurate at any time without prior notice.
            </p>

            <h2>5. Service Level Agreement (SLA)</h2>
            <p>
              For enterprise customers on the Revenue Platform, specific uptime guarantees and support response times are governed by the Master Service Agreement (MSA) executed separately. The ARC platform is provided on a commercially reasonable effort basis.
            </p>

            <h2>6. Intellectual Property Rights</h2>
            <p>
              This Agreement does not transfer to you any intellectual property owned by Growmax or third parties, and all rights, titles, and interests in and to such property will remain (as between the parties) solely with Growmax. All trademarks, service marks, graphics and logos used in connection with our Website or Services, are trademarks or registered trademarks of Growmax or Growmax licensors.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, in no event will Growmax, its affiliates, officers, directors, employees, agents, suppliers or licensors be liable to any person for any indirect, incidental, special, punitive, cover or consequential damages (including, without limitation, damages for lost profits, revenue, sales, goodwill, use of content, impact on business, business interruption, loss of anticipated savings, loss of business opportunity) however caused.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}