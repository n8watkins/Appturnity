import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Smooth scrolls to the HTML element with the provided ID
 * @param elementId - The ID of the element to scroll to (without the # prefix)
 * @param offset - Optional offset from the top of the element (default: 80px to account for fixed header)
 */
export function scrollToElement(elementId: string, offset: number = 80) {
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}

/**
 * Handle clicks on anchor links with smooth scrolling
 * @param event - The click event
 * @param targetId - The ID of the target element (without the # prefix)
 * @param callback - Optional callback to execute after click (e.g., closing a mobile menu)
 */
export function handleSmoothScroll(
  event: React.MouseEvent<HTMLAnchorElement>,
  targetId: string,
  callback?: () => void
) {
  event.preventDefault();

  // Extract query params from the href if present
  const href = event.currentTarget.getAttribute('href') || '';
  const queryStart = href.indexOf('?');
  const queryParams = queryStart !== -1 ? href.substring(queryStart) : '';

  // Update URL with query params if present
  if (queryParams) {
    window.history.pushState({}, '', `#${targetId}${queryParams}`);
  }

  scrollToElement(targetId);

  if (callback) {
    callback();
  }
}
