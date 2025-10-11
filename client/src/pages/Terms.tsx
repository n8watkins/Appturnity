import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Use</h1>
          <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using Appturnity's website and services, you agree to be bound by these Terms of Use.
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              Appturnity provides web design and development consulting services, including but not limited to:
            </p>
            <ul>
              <li>Custom landing page development</li>
              <li>Web application development</li>
              <li>Business website design</li>
              <li>Web consulting services</li>
            </ul>

            <h2>3. Use of Website</h2>
            <p>
              You agree to use our website only for lawful purposes. You must not:
            </p>
            <ul>
              <li>Use the website in any way that violates any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Submit false, misleading, or fraudulent information through contact forms</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of
              Appturnity or its content suppliers and is protected by United States and international copyright laws.
            </p>

            <h2>5. Services and Pricing</h2>
            <p>
              All project quotes and pricing information provided on our website or through consultations are estimates
              and subject to change based on project scope and requirements. Final pricing will be agreed upon in writing
              before work begins.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              Appturnity shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use or inability to use our services or website.
            </p>

            <h2>7. External Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the content or practices
              of these external sites.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
              to the website. Your continued use of our services after changes are posted constitutes acceptance of the
              modified terms.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the State of California,
              United States, without regard to its conflict of law provisions.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <ul>
              <li>Email: nathancwatkins23@gmail.com</li>
              <li>Phone: (818) 288-8082</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
