import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface ScrollToTopProps {
  behavior?: ScrollBehavior;
}

/**
 * ScrollToTop Component
 * Automatically scrolls the window to the top (0, 0) whenever the route pathname changes.
 * Mount this component once inside BrowserRouter.
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({ behavior = 'smooth' }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    } catch {
      // Fallback for older browsers or strict environments
      window.scrollTo(0, 0);
    }
  }, [pathname, behavior]);

  return null;
};

export default ScrollToTop;
