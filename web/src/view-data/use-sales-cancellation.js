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
  return { ..._.omit(data, 'user'), userId: _.get(data, 'user.id') };
};

const useSalesCancellation = () => {
  const { state = initialState, dispatch } = useGlobalContext('sales-cancellation'),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const { data, mutate } = useFetch({
    url: 'sales-cancellation/list',
    method: 'POST',
    params: { ...getParams(_.get(headerState, 'filter.data')), offset: state.offset || 0 }
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Vendas Canceladas',
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
      dispatch({ payload: { model: {}, formLoading: true, showForm: true } });
      let model = { active: true };

      if (data.id) {
        const response = await api.get('sales-cancellation/load', { params: { id: data.id } });
        model = { ...response.data, saleTag: data.tag};
      }
      dispatch({ payload: { model, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const createOrUpdate = async (model, actions) => {
    try {
      dispatch({ payload: { formLoading: true } });

      await api.post(`sales-cancellation/create-or-update`, model);

      mutate(data);

      showMessage('success', `Motivo do cancelamento atualizado com sucesso`);
      dispatch({ payload: { formLoading: false, showForm: false } });

      actions.toogleForm && actions.toogleForm();
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listCancellationTypes = (tag) => async (term, callback) => {
    try {
      const response = await api.get(`sales-cancellation/list-cancellation-types`, { params: { term, tag } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listUsers = async (term, callback) => {
    try {
      const response = await api.get(`sales-cancellation/list-users`, { params: { term } });
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
      createOrUpdate,
      hideForm,
      changeFilter,
      listCancellationTypes,
      listUsers,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useSalesCancellation;
