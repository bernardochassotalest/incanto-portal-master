import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function useKey({key, handler}) {
  const callbackRef = useRef(handler);

  useEffect(() => {
    callbackRef.current = handler;
  });

  useEffect(() => {
    function handle(event) {
      // event is fired for any key
      if (!key) {
        callbackRef.current(event);
      }
      // event is fired for specific key
      if (key && event.code === key) {
        callbackRef.current(event);
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
};

useKey.propTypes = {
  key: PropTypes.string,
  handler: PropTypes.func.isRequired,
}

export default useKey;
