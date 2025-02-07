import { useEffect, useRef } from 'react';

const useEventListener = ({ name, handler, element, elementId }) => {
  const savedHandler = useRef()
    , baseEl = elementId ? document.getElementById(elementId) : (element || window);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = baseEl && baseEl.addEventListener;

      if (!isSupported) return;

      const eventListener = event => savedHandler.current(event);
      baseEl.addEventListener(name, eventListener);

      return () => {
        baseEl.removeEventListener(name, eventListener);
      };
    },
    [name, baseEl]
  );
};

export default useEventListener;
