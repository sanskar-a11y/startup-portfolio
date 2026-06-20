import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      window.addEventListener("resize", handleResize);
      handleResize();
    
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
}
