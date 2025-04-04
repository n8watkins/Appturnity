import React, { useEffect, useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface CalendlyEmbedProps {
  url: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: {
      [key: string]: string;
    };
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
}

// Load the Calendly script once
const loadCalendlyScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      // Check if Calendly is already loaded
      if ((window as any).Calendly) {
        resolve();
        return;
      }
      
      // Check if script is already being loaded
      if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
        // If script is loading, wait for it to complete
        const checkCalendly = setInterval(() => {
          if ((window as any).Calendly) {
            clearInterval(checkCalendly);
            resolve();
          }
        }, 100);
        return;
      }
      
      // Load the script if not already loaded or loading
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.onload = () => resolve();
      script.async = true;
      document.head.appendChild(script);
    }
  });
};

// Embedded Calendly widget component
export function CalendlyEmbed({ 
  url,
  prefill,
  utm,
  className = ''
}: CalendlyEmbedProps & { className?: string }) {
  const calendlyRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendlyRoot.current) return;
    
    let cleanup: () => void;
    
    const initCalendly = async () => {
      await loadCalendlyScript();
      
      if (!calendlyRoot.current || !(window as any).Calendly) return;
      
      (window as any).Calendly.initInlineWidget({
        url: url,
        parentElement: calendlyRoot.current,
        prefill: prefill,
        utm: utm
      });
      
      // Return cleanup function
      cleanup = () => {
        // Clean up any event listeners or references if needed
        if (calendlyRoot.current) {
          calendlyRoot.current.innerHTML = '';
        }
      };
    };
    
    initCalendly();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [url, prefill, utm]);
  
  return (
    <div 
      ref={calendlyRoot} 
      className={`calendly-inline-widget ${className}`}
      style={{ minHeight: '650px' }}
      data-auto-load="false"
    ></div>
  );
}

// Button that opens Calendly in a popup
export function CalendlyButton({ 
  url,
  children = "Schedule a meeting",
  prefill,
  utm,
  ...props
}: CalendlyEmbedProps & { children?: React.ReactNode } & ButtonProps) {
  
  useEffect(() => {
    loadCalendlyScript();
  }, []);
  
  const handleClick = async () => {
    await loadCalendlyScript();
    
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: url,
        prefill: prefill,
        utm: utm
      });
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      <Calendar className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}