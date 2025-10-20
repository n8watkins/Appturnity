import { Phone, Mail, Calendar } from "lucide-react";
import { Link } from "wouter";
import { handleSmoothScroll } from "@/lib/utils";

const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/nathancwatkins23/web-consulting";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/">
              <a className="inline-block mb-4">
                <img
                  src="/appturnity.webp"
                  alt="Appturnity"
                  width={180}
                  height={180}
                  className="brightness-0 invert"
                />
              </a>
            </Link>
            <p className="mb-4 text-sm">
              Custom websites without the complexity.
              <br />
              Simple solutions. Predictable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleSmoothScroll(e, "about")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#how-we-work"
                  onClick={(e) => handleSmoothScroll(e, "how-we-work")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How We Work
                </a>
              </li>
              <li>
                <a
                  href="#what-you-get"
                  onClick={(e) => handleSmoothScroll(e, "what-you-get")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  What You Get
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  onClick={(e) => handleSmoothScroll(e, "portfolio")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  onClick={(e) => handleSmoothScroll(e, "testimonials")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#quiz"
                  onClick={(e) => {
                    handleSmoothScroll(e, "quiz");
                    // Dispatch event to auto-start the quiz
                    setTimeout(() => {
                      window.dispatchEvent(new Event("startQuiz"));
                    }, 500);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Service Quiz
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleSmoothScroll(e, "pricing")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Build Your Solution
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog">
                  <a
                    className="hover:text-white transition-colors cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href="#pricing-tiers"
                  onClick={(e) => handleSmoothScroll(e, "pricing-tiers")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pricing Tiers
                </a>
              </li>
              <li>
                <Link href="/features">
                  <a
                    className="hover:text-white transition-colors cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    All Features
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms">
                  <a
                    className="hover:text-white transition-colors cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Terms of Use
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a
                    className="hover:text-white transition-colors cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Privacy Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Calendar size={16} />
                  <span>Schedule a Call</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+18182888082"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone size={16} />
                  <span>(818) 288-8082</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:nathancwatkins23@gmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors break-all"
                >
                  <Mail size={16} />
                  <span>Get in Touch</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Appturnity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
