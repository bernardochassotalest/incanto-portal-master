import _ from 'lodash';
import useGlobalContext from '~/view-data/use-global-context';

const initialState = {
  filter: {
    use: false,
    visible: false,
    data: {},
  },
};

const useHeader = ({ useFilter = false }) => {
  const { state = initialState, dispatch } = useGlobalContext('header');

  const configure = (options) => {
    const {
      filter = { use: useFilter, visible: false, data: {} },
      onSearch = null,
      count = 'none',
      ...rest
    } = options;

    dispatch({ merge: true, payload: { ...rest, onSearch, count, filter } });
  };

  const showFilter = () => {
    dispatch({ merge: true, payload: { filter: { visible: true } } });
  };

  const hideFilter = () => {
    dispatch({ merge: true, payload: { filter: { visible: false } } });
  };

  const clearFilter = (data) => {
    dispatch({ payload: { filter: { use: useFilter, data, visible: true } } });
  };

  const callFilter = (data = {}, actionFilter = _.noop) => {
    dispatch({ payload: { filter: { use: useFilter, data, visible: true } }});
    actionFilter(data);
  };

  return {
    state: {
      ...state,
    },
    actions: {
      configure,
      showFilter,
      hideFilter,
      callFilter,
      clearFilter,
    }
  };
};

export default useHeader;
