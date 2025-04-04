import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface CalendlyEmbedProps {
  url: string;
  styles?: React.CSSProperties;
  className?: string;
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

export function CalendlyInlineEmbed({
  url,
  styles = {},
  className = '',
  prefill,
  utm,
}: CalendlyEmbedProps) {
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendlyRef.current) return;

    // Build the URL with any prefill parameters
    let embedUrl = url;
    const params = new URLSearchParams();

    // Add prefill parameters if they exist
    if (prefill) {
      if (prefill.name) params.append('name', prefill.name);
      if (prefill.email) params.append('email', prefill.email);
      if (prefill.customAnswers) {
        Object.entries(prefill.customAnswers).forEach(([key, value]) => {
          params.append(`a1=${key}`, value);
        });
      }
    }

    // Add UTM parameters if they exist
    if (utm) {
      if (utm.utmCampaign) params.append('utm_campaign', utm.utmCampaign);
      if (utm.utmSource) params.append('utm_source', utm.utmSource);
      if (utm.utmMedium) params.append('utm_medium', utm.utmMedium);
      if (utm.utmContent) params.append('utm_content', utm.utmContent);
      if (utm.utmTerm) params.append('utm_term', utm.utmTerm);
    }

    // Append the params to the URL if there are any
    const paramsString = params.toString();
    if (paramsString) {
      embedUrl += `?${paramsString}`;
    }

    // Create the Calendly embed
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Calendly after the script has loaded
    script.onload = () => {
      if (calendlyRef.current && (window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: embedUrl,
          parentElement: calendlyRef.current,
          prefill,
          utm,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [url, prefill, utm]);

  return (
    <div 
      ref={calendlyRef} 
      className={`calendly-inline-widget ${className}`} 
      style={{ minWidth: '320px', height: '630px', ...styles }}
    />
  );
}

export function CalendlyPopupButton({ 
  url,
  children = "Schedule a meeting",
  prefill,
  utm,
  ...props
}: CalendlyEmbedProps & { children?: React.ReactNode } & ButtonProps) {
  
  const handleClick = () => {
    if (!(window as any).Calendly) {
      // Load the Calendly script if it hasn't been loaded yet
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        openCalendly();
      };
    } else {
      openCalendly();
    }
  };

  const openCalendly = () => {
    (window as any).Calendly.initPopupWidget({
      url,
      prefill,
      utm,
    });
    return false;
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

export function CalendlyDialog({ 
  url,
  buttonText = "Schedule a meeting",
  prefill,
  utm,
  buttonProps,
}: CalendlyEmbedProps & { 
  buttonText?: string,
  buttonProps?: ButtonProps 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...buttonProps}>
          <Calendar className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <CalendlyInlineEmbed 
          url={url} 
          prefill={prefill} 
          utm={utm} 
          styles={{ height: '600px', width: '100%' }}
        />
      </DialogContent>
    </Dialog>
  );
}