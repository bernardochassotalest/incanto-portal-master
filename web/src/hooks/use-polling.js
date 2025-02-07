import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import api from '~/services/api';

const usePolling = (props) => {
  const { serviceName, interval, onData, onError, params = {} } = props
  const [ execute, setExecute ] = useState(false);
  const [ polling, setPolling ] = useState();

  const stop = useCallback(() => {
    if (polling) {
      clearInterval(polling);
      setPolling(null);
    }
  }, [polling]);

  const start = useCallback(() => {
    stop();
    setTimeout(() => setExecute(true), 100);
    setPolling(
      setInterval(() => {
        setExecute(true);
      }, interval)
    );
  }, [interval, stop]);

  useEffect(() => {
    return stop;
  }, [stop]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    function run() {
      api.get(serviceName, { params, cancelToken: source.token })
        .then(onData)
        .catch(onError)
        .finally(() => setExecute(false));
    }

    if (execute) run();

    return () => {
      source.cancel();
    }
  }, [execute, params, onData, onError, serviceName, stop]);

  return {
    start,
    stop,
    running: execute
  }
};

export default usePolling;
