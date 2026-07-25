import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls the window to the top (0, 0) whenever the route pathname changes.
 * Mount this component once inside BrowserRouter.
 *
 * @param {Object} props
 * @param {ScrollBehavior} [props.behavior="smooth"] - Scroll behavior ("smooth" or "auto")
 */
export const ScrollToTop = ({ behavior = 'smooth' }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname, behavior]);

  return null;
};

export default ScrollToTop;
