import _ from 'lodash';
import { useEffect } from 'react';
import { showMessage } from '~/helper';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import useFetch from '~/view-data/use-fetch';
import useHeader from '~/view-data/use-header';

const initialState = {
  loading: false,
  showForm: false,
  formLoading: false,
  term: null,
  offset: 0,
  model: null,
  data: { rows: [], count: 0, offset: 0 },
};

const getParams = (data) => {
  return { ..._.omit(data, 'group'), groupId: _.get(data, 'group.id') };
};

const useBusinessPartners = () => {
  const { state = initialState, dispatch } = useGlobalContext('businessPartners'),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const { data } = useFetch({
    url: 'business-partners/list',
    method: 'POST',
    params: { ...getParams(_.get(headerState, 'filter.data')), offset: state.offset || 0 }
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Parceiros de Negócio',
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

  const hideForm = async () => {
    dispatch({ payload: { model: {}, showForm: false }});
    headerActions.hideFilter();
  };

  const changeFilter = (data) => {
    dispatch({ payload: { offset: 0, model: {}, showForm: false }});
    headerActions.callFilter(data);
  };

  const load = async (data = {}) => {
    try {
      dispatch({ payload: { model: {}, formLoading: true, showForm: true }});
      let model = {};

      if (data.cardCode) {
        const response = await api.get('business-partners/load', { params: { cardCode: data.cardCode } });
        model = response.data;
      }
      dispatch({ payload: { model, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listGroups = async (term, callback) => {
    try {
      const response = await api.get(`business-partners/list-groups`, { params: { term } });
      callback(response.data);
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
      hideForm,
      changeFilter,
      listGroups,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useBusinessPartners;
