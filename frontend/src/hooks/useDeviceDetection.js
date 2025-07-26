import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting mobile devices and touch capabilities
 * @returns {Object} Device detection information
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    orientation: 'landscape'
  });

  useEffect(() => {
    const detectDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mobile detection
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileScreen = width <= 768;
      const isMobile = (hasTouch && isMobileScreen) || (isMobileUA && isMobileScreen);

      // Tablet detection
      const isTabletScreen = width > 768 && width <= 1024;
      const isTablet = hasTouch && isTabletScreen && !isMobile;

      // Desktop detection
      const isDesktop = !isMobile && !isTablet;

      // Orientation detection
      const orientation = width > height ? 'landscape' : 'portrait';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        orientation,
        screenWidth: width,
        screenHeight: height
      });

      // Add CSS classes to body for styling purposes
      document.body.classList.toggle('mobile-device', isMobile);
      document.body.classList.toggle('tablet-device', isTablet);
      document.body.classList.toggle('desktop-device', isDesktop);
      document.body.classList.toggle('touch-device', hasTouch);
      document.body.classList.toggle('orientation-portrait', orientation === 'portrait');
      document.body.classList.toggle('orientation-landscape', orientation === 'landscape');
    };

    // Initial detection
    detectDevice();

    // Listen for resize and orientation changes
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      // Clean up CSS classes
      document.body.classList.remove(
        'mobile-device', 
        'tablet-device', 
        'desktop-device', 
        'touch-device',
        'orientation-portrait',
        'orientation-landscape'
      );
    };
  }, []);

  return deviceInfo;
};

/**
 * Simplified hook for just mobile detection
 * @returns {boolean} Whether the device is mobile
 */
export const useIsMobile = () => {
  const { isMobile } = useDeviceDetection();
  return isMobile;
};

/**
 * Hook for touch capability detection
 * @returns {boolean} Whether the device supports touch
 */
export const useHasTouch = () => {
  const { hasTouch } = useDeviceDetection();
  return hasTouch;
};

export default useDeviceDetection;