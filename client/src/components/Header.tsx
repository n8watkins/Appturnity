import { useState } from "react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, BookOpen } from "lucide-react";
import { scrollToElement } from "@/lib/utils";
import { Helmet } from "react-helmet";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    startQuiz?: boolean
  ) => {
    e.preventDefault();

    // If we're not on the home page, navigate there first
    if (location !== "/") {
      setLocation("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        if (startQuiz && targetId === "quiz") {
          window.dispatchEvent(new Event("startQuiz"));
        }
        if (targetId) {
          scrollToElement(targetId);
        }
      }, 300);
    } else {
      // We're already on home page, just scroll
      if (startQuiz && targetId === "quiz") {
        window.dispatchEvent(new Event("startQuiz"));
      }
      if (targetId) {
        setTimeout(() => {
          scrollToElement(targetId);
        }, 100);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLocation("/");
    // Scroll to top when navigating to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLocation("/blog");
    // Scroll to top when navigating to blog
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const navigateAndClose = (e: React.MouseEvent<HTMLAnchorElement>, startQuiz?: boolean) => {
    // Get the target ID from the href attribute
    const href = e.currentTarget.getAttribute("href") || "";
    const hashIndex = href.indexOf("#");

    let targetId = "";
    if (hashIndex !== -1) {
      targetId = href.substring(hashIndex + 1);
    }

    setIsOpen(false);
    handleNavClick(e, targetId, startQuiz);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm select-none">
      <Helmet>
        <title>Appturnity - Web Consulting</title>
        <meta name="description" content="Custom landing pages built to drive trust and growth." />
        <meta
          name="google-site-verification"
          content="tY1kZLONMnmFfumFbh0EHixuCoGOFCmvNJW8qVYIRHA"
        />
        <link rel="icon" href="/a-icon.png" />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleLogoClick}
            >
              <img src="/appturnity.webp" alt="Appturnity" width={200} height={200} />
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#about"
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavClick(e, "about")}
            >
              About
            </a>
            <a
              href="#portfolio"
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavClick(e, "portfolio")}
            >
              Portfolio
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavClick(e, "testimonials")}
            >
              Testimonials
            </a>
            <a
              href="#pricing-tiers"
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavClick(e, "pricing-tiers")}
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavClick(e, "contact")}
            >
              Contact
            </a>
            <a
              href="#quiz"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
              onClick={(e) => handleNavClick(e, "quiz", true)}
            >
              <Sparkles className="h-4 w-4" />
              <span className="lg:hidden">Quiz</span>
              <span className="hidden lg:inline">Take Quiz</span>
            </a>
            <a
              href="/blog"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border-2 border-primary text-primary hover:bg-primary/5 transition-all duration-200 shadow-sm"
              onClick={handleBlogClick}
            >
              <BookOpen className="h-4 w-4" />
              <span className="lg:hidden">Blog</span>
              <span className="hidden lg:inline">Check out our Blog</span>
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
                    href="#about"
                    className="text-slate-700 hover:text-primary transition-colors"
                    onClick={navigateAndClose}
                  >
                    About
                  </a>
                  <a
                    href="#portfolio"
                    className="text-slate-700 hover:text-primary transition-colors"
                    onClick={navigateAndClose}
                  >
                    Portfolio
                  </a>
                  <a
                    href="#testimonials"
                    className="text-slate-700 hover:text-primary transition-colors"
                    onClick={navigateAndClose}
                  >
                    Testimonials
                  </a>
                  <a
                    href="#pricing-tiers"
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
                  <a
                    href="#quiz"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                    onClick={(e) => navigateAndClose(e, true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Take Quiz
                  </a>
                  <a
                    href="/blog"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white border-2 border-primary text-primary hover:bg-primary/5 transition-all duration-200 shadow-sm"
                    onClick={(e) => {
                      setIsOpen(false);
                      handleBlogClick(e);
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    Check out our Blog
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
