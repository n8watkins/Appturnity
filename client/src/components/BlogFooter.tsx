import { Link, useLocation } from "wouter";
import { Mail, Linkedin, X } from "lucide-react";

export default function BlogFooter() {
  const [, setLocation] = useLocation();

  const handleMainSiteNav = (section: string) => {
    setLocation('/');
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <Link href="/">
              <a className="inline-block mb-4">
                <img src="/appturnity.webp" alt="Appturnity" width={180} height={180} className="brightness-0 invert" />
              </a>
            </Link>
            <p className="text-slate-400 text-sm mb-4">
              Custom web solutions that drive growth and build trust.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/appturnity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on X"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@appturnity.com"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Email us"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
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
                  onClick={() => handleMainSiteNav("portfolio")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMainSiteNav("pricing-tiers")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
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

          {/* Blog Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Blog</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    All Posts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    Business Strategy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    Web Development
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    Case Studies
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleMainSiteNav("contact")}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <a
                  href="mailto:hello@appturnity.com"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  hello@appturnity.com
                </a>
              </li>
              <li>
                <Link href="/">
                  <a className="text-slate-400 hover:text-white transition-colors text-sm">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleMainSiteNav("contact");
                    setTimeout(() => {
                      window.dispatchEvent(new Event('startQuiz'));
                    }, 400);
                  }}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
                >
                  Take the Quiz
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} Appturnity. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/">
                <a className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/">
                <a className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </Link>
              <Link href="/blog">
                <a className="text-slate-400 hover:text-white transition-colors">
                  Sitemap
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
