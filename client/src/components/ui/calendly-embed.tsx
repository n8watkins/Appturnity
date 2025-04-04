import React, { useEffect } from 'react';
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

// Simple button that opens Calendly in a new window
export function CalendlyButton({ 
  url,
  children = "Schedule a meeting",
  prefill,
  utm,
  ...props
}: CalendlyEmbedProps & { children?: React.ReactNode } & ButtonProps) {
  
  // Effect to load the Calendly script once when component mounts
  useEffect(() => {
    // Only add the script if it doesn't exist already
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  
  const handleClick = () => {
    // Open Calendly in a new window directly
    const baseUrl = url;
    const params = new URLSearchParams();
    
    // Add prefill parameters
    if (prefill) {
      if (prefill.name) params.append('name', prefill.name);
      if (prefill.email) params.append('email', prefill.email);
      if (prefill.customAnswers) {
        Object.entries(prefill.customAnswers).forEach(([key, value]) => {
          params.append(`a1`, value);
        });
      }
    }
    
    // Add UTM parameters
    if (utm) {
      if (utm.utmCampaign) params.append('utm_campaign', utm.utmCampaign);
      if (utm.utmSource) params.append('utm_source', utm.utmSource);
      if (utm.utmMedium) params.append('utm_medium', utm.utmMedium);
      if (utm.utmContent) params.append('utm_content', utm.utmContent);
      if (utm.utmTerm) params.append('utm_term', utm.utmTerm);
    }
    
    // Build the final URL
    const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    
    // Open in a new window
    window.open(finalUrl, '_blank');
  };

  return (
    <Button onClick={handleClick} {...props}>
      <Calendar className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}