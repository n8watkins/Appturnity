import { useState } from "react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigateAndClose = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="font-bold text-lg text-slate-900">Stupid Simple Apps</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-slate-600 hover:text-primary transition-colors">How It Works</a>
            <a href="#about" className="text-slate-600 hover:text-primary transition-colors">About</a>
            <a href="#testimonials" className="text-slate-600 hover:text-primary transition-colors">Testimonials</a>
            <a href="#contact" className="text-slate-600 hover:text-primary transition-colors">Contact</a>
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
                    href="#how-it-works" 
                    className="text-slate-700 hover:text-primary transition-colors" 
                    onClick={navigateAndClose}
                  >
                    How It Works
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
