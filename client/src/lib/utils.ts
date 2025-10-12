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
 * @param startQuiz - Optional flag to auto-start the quiz when navigating to contact section
 */
export function handleSmoothScroll(
  event: React.MouseEvent<HTMLAnchorElement>,
  targetId: string,
  callback?: () => void,
  startQuiz?: boolean
) {
  event.preventDefault();

  // Dispatch quiz start event BEFORE scrolling if requested
  if (startQuiz && targetId === 'contact') {
    window.dispatchEvent(new Event('startQuiz'));
  }

  scrollToElement(targetId);

  if (callback) {
    callback();
  }
}
