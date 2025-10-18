import { Link, useLocation } from "wouter";
import { Mail, Phone, Calendar } from "lucide-react";

const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/nathancwatkins23/web-consulting";

export default function BlogFooter() {
  const [, setLocation] = useLocation();

  const handleMainSiteNav = (section: string) => {
    setLocation("/");
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div>
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
            <p className="text-slate-400 text-sm mb-4">
              Custom websites without the complexity. Simple solutions. Predictable prices.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/appturnity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Follow us on X"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="mailto:nathancwatkins23@gmail.com"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Email us"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleMainSiteNav("about")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("how-we-work")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  How We Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("what-you-get")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  What You Get
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("portfolio")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("testimonials")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleMainSiteNav("quiz")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Service Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("pricing")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Pricing Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("pricing-tiers")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Pricing Tiers
                </button>
              </li>
              <li>
                <Link href="/features">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    All Features
                  </a>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("contact")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    Terms of Use
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule a Call</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+18182888082"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>(818) 288-8082</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:nathancwatkins23@gmail.com"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Get in Touch</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 mt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} Appturnity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
