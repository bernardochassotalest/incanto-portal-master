import PropTypes from 'prop-types';
import useSWR from 'swr';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';

function useFetch(request, { initialData, ...config } = {}) {
  const { state: { auth = {} } } = useGlobalContext();

  if (auth && auth.token) {
    api.defaults.headers.Authorization = `Bearer ${auth.token}`;
  }

  return useSWR(
    request && JSON.stringify(request),
    () => api(request || {}).then((response) => response.data),
    {
      ...config,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        headers: {},
        data: initialData,
      },
    }
  );
}

useFetch.propTypes = {
  resource: PropTypes.string.isRequired,
};

export default useFetch;
