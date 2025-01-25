import { useState, useEffect, useRef } from 'react';

function useComponentWidth() {
  const [width, setWidth] = useState(0);
  const componentRef = useRef(null);

  useEffect(() => {
    const getWidth = () => componentRef.current?.offsetWidth || 0;

    const handleResize = () => {
      setWidth(getWidth());
    };

    if (componentRef.current) {
      setWidth(getWidth());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [width, componentRef];
}

export default useComponentWidth;
