import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";

export default function BlogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleMainSiteNav = (section: string, startQuiz?: boolean) => {
    setLocation('/');
    setTimeout(() => {
      if (startQuiz && section === 'contact') {
        window.dispatchEvent(new Event('startQuiz'));
      }
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center space-x-2 cursor-pointer">
                <img src="/appturnity.webp" alt="Appturnity" width={180} height={180} />
              </a>
            </Link>
            <span className="hidden md:block text-slate-400 text-sm">|</span>
            <Link href="/blog">
              <a className="hidden md:block text-lg font-semibold text-slate-900 hover:text-primary transition-colors">
                Blog
              </a>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleMainSiteNav("how-we-work")}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              How We Work
            </button>
            <button
              onClick={() => handleMainSiteNav("portfolio")}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => handleMainSiteNav("pricing-tiers")}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <Link href="/blog">
              <a className="text-slate-600 hover:text-primary transition-colors">
                All Posts
              </a>
            </Link>
            <button
              onClick={() => handleMainSiteNav("contact", true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              Get Started
            </button>
          </nav>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Menu">
                  <Menu className="h-6 w-6 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/blog">
                    <a className="text-slate-700 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                      All Posts
                    </a>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleMainSiteNav("how-we-work");
                    }}
                    className="text-slate-700 hover:text-primary transition-colors text-left"
                  >
                    How We Work
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleMainSiteNav("portfolio");
                    }}
                    className="text-slate-700 hover:text-primary transition-colors text-left"
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleMainSiteNav("pricing-tiers");
                    }}
                    className="text-slate-700 hover:text-primary transition-colors text-left"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleMainSiteNav("contact", true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    Get Started
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
