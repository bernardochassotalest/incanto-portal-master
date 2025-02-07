import _ from 'lodash';
import { useEffect } from 'react';
import { showMessage } from '~/helper';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import useFetch from '~/view-data/use-fetch';
import useHeader from '~/view-data/use-header';

const initialState = {
  loading: false,
  formLoading: false,
  term: null,
  offset: 0,
  model: null,
  data: { rows: [], count: 0, offset: 0 },
};

const useChartOfAccounts = () => {
  const { state = initialState, dispatch } = useGlobalContext('chartOfAccounts'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const { data } = useFetch({
    url: 'chart-of-accounts/list',
    params: { term: state.term, offset: state.offset },
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Plano de Contas',
      count: _.get(data, 'count', 0),
      loading: _.get(state, 'loading', false),
      onSearch: (text) => list(0, text),
    });
    // eslint-disable-next-line
  }, [data, state]);

  const list = (offset = 0, term) => {
    dispatch({ payload: { offset, term } });
  };

  const pageChange = (offset = 0) => {
    dispatch({ payload: { offset } });
  };

  const load = async (data = {}) => {
    try {
      dispatch({ payload: { model: {}, formLoading: true }});
      let model = {};

      if (data.acctCode) {
        const response = await api.get('chart-of-accounts/load', { params: { acctCode: data.acctCode } });
        model = response.data;
      }
      dispatch({ payload: { model, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  return {
    state: {
      ...state,
      data: data || {},
      loading: !data,
    },
    actions: {
      pageChange,
      load,
      list,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useChartOfAccounts;
