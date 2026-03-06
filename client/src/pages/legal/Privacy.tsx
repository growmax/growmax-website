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
            Last Updated: January 2026
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-growmax-black prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed prose-a:text-growmax-red">
            
            <p className="font-mono text-xs md:text-sm uppercase bg-gray-50 p-3 md:p-4 border border-gray-200 mb-6 md:mb-8">
              Webspot Growmax Commerce Private Limited / Growmax LLC ("Growmax", "we", "us", or "our") respects your privacy and is committed to protecting it through our compliance with this policy.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of our Website and Platform, including information:
            </p>
            <ul>
              <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number, or any other identifier by which you may be contacted online or offline ("personal information");</li>
              <li>That is about you but individually does not identify you, such as your company name, job title, and industry; and/or</li>
              <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
            </ul>

            <h2>2. How We Collect Information</h2>
            <p>We collect this information:</p>
            <ul>
              <li>Directly from you when you provide it to us (e.g., by filling out forms to request a demo or register for an account).</li>
              <li>Automatically as you navigate through the site. Information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use information that we collect about you or that you provide to us, including any personal information:
            </p>
            <ul>
              <li>To present our Website and its contents to you.</li>
              <li>To provide you with information, products, or services that you request from us.</li>
              <li>To fulfill any other purpose for which you provide it.</li>
              <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
              <li>To notify you about changes to our Website or any products or services we offer or provide though it.</li>
            </ul>

            <h2>4. Data Security & Encryption</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.
            </p>
            <p>
              The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Website, you are responsible for keeping this password confidential.
            </p>

            <h2>5. Changes to Our Privacy Policy</h2>
            <p>
              It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the Website home page.
            </p>

            <h2>6. Contact Information</h2>
            <p>
              To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href="mailto:hello@growmax.io">hello@growmax.io</a>.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}