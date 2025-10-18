import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Privacy() {
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

          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul>
              <li>Fill out our contact form (name, email, company, message)</li>
              <li>Use our pricing calculator</li>
              <li>Schedule a consultation through our website</li>
              <li>Communicate with us via email or phone</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we automatically collect certain information, including:
            </p>
            <ul>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and provide customer service</li>
              <li>Send you project quotes and proposals</li>
              <li>Improve our website and services</li>
              <li>Send you relevant updates about our services (with your consent)</li>
              <li>Analyze website usage and trends</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>

            <h2>3. Google Analytics</h2>
            <p>
              We use Google Analytics to understand how visitors interact with our website. Google
              Analytics uses cookies to collect information such as how often users visit our site,
              what pages they visit, and what other sites they used prior to coming to our site. We
              use this information to improve our website.
            </p>
            <p>
              Google's ability to use and share information collected by Google Analytics is
              restricted by the Google Analytics Terms of Service and the Google Privacy Policy. You
              can opt-out of Google Analytics by installing the Google Analytics Opt-out Browser
              Add-on.
            </p>

            <h2>4. reCAPTCHA</h2>
            <p>
              We use Google reCAPTCHA to protect our contact form from spam and abuse. reCAPTCHA
              collects hardware and software information and sends it to Google for analysis. This
              information is used solely for anti-abuse purposes. Use of reCAPTCHA is subject to the
              Google Privacy Policy and Terms of Use.
            </p>

            <h2>5. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may
              share your information in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We use Resend for email delivery. They process
                information on our behalf.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, sale, or transfer
                of assets
              </li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect
              your personal information. However, no method of transmission over the Internet is
              100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your personal information</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your browsing experience.
              You can control cookies through your browser settings. However, disabling cookies may
              limit your ability to use certain features of our website.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly
              collect personal information from children under 18. If we become aware that we have
              collected such information, we will take steps to delete it.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>11. California Privacy Rights</h2>
            <p>
              If you are a California resident, you have specific rights regarding your personal
              information under the California Consumer Privacy Act (CCPA), including the right to
              know what information we collect and the right to request deletion of your
              information.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices,
              please contact us:
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
