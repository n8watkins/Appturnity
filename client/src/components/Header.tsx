import { useState } from "react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { handleSmoothScroll, scrollToElement } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigateAndClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Get the target ID from the href attribute
    const href = e.currentTarget.getAttribute('href');
    const targetId = href?.replace('#', '');
    
    e.preventDefault();
    setIsOpen(false);
    
    // Small delay to allow the mobile menu to close before scrolling
    if (targetId) {
      setTimeout(() => {
        scrollToElement(targetId);
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold text-lg text-slate-900">Appturnity</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#how-we-work" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleSmoothScroll(e, "how-we-work")}
            >
              How We Work
            </a>
            <a 
              href="#about" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleSmoothScroll(e, "about")}
            >
              About
            </a>
            <a 
              href="#testimonials" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleSmoothScroll(e, "testimonials")}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleSmoothScroll(e, "pricing")}
            >
              Pricing
            </a>
            <a 
              href="#contact" 
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              onClick={(e) => handleSmoothScroll(e, "contact")}
            >
              Contact
            </a>
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
                  <a 
                    href="#how-we-work" 
                    className="text-slate-700 hover:text-primary transition-colors" 
                    onClick={navigateAndClose}
                  >
                    How We Work
                  </a>
                  <a 
                    href="#about" 
                    className="text-slate-700 hover:text-primary transition-colors" 
                    onClick={navigateAndClose}
                  >
                    About
                  </a>
                  <a 
                    href="#testimonials" 
                    className="text-slate-700 hover:text-primary transition-colors" 
                    onClick={navigateAndClose}
                  >
                    Testimonials
                  </a>
                  <a 
                    href="#pricing" 
                    className="text-slate-700 hover:text-primary transition-colors" 
                    onClick={navigateAndClose}
                  >
                    Pricing
                  </a>
                  <a 
                    href="#contact" 
                    className="text-slate-700 hover:text-primary transition-colors" 
                    onClick={navigateAndClose}
                  >
                    Contact
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
