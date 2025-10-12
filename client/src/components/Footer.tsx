import { Phone, Mail, Calendar } from "lucide-react";
import { handleSmoothScroll } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold text-lg text-white">Appturnity</span>
            </div>
            <p className="mb-4">
              Custom apps without the complexity.<br />
              Simple solutions. Predictable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <div>
            <h3 className="text-white font-semibold mb-4">Sitemap</h3>
            <ul className="space-y-2">
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
                  href="#about"
                  onClick={(e) => handleSmoothScroll(e, "about")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
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

            <div>
              <h3 className="text-white font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#pricing"
                    onClick={(e) => handleSmoothScroll(e, "pricing")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing Calculator
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => handleSmoothScroll(e, "contact", undefined, true)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Service Quiz
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://calendly.com/nathancwatkins23/web-consulting?month=2025-04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Calendar size={16} />
                  <span>Schedule a Call</span>
                </a>
              </li>
              <li>
                <a href="tel:+18182888082" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={16} />
                  <span>(818) 288-8082</span>
                </a>
              </li>
              <li>
                <a href="mailto:nathancwatkins23@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} />
                  <span>nathancwatkins23@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-10 pt-6 text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Appturnity. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
