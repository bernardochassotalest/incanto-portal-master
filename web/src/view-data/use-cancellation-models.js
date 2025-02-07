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
  tags: [],
  data: { rows: [], count: 0, offset: 0 },
};

const useCancellationModels = () => {
  const { state = initialState, dispatch } = useGlobalContext('cancellation-models'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const { data, mutate } = useFetch({
    url: 'cancellation-models/list',
    params: { term: state.term, offset: state.offset },
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Tipos de Cancelamento',
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
      dispatch({ payload: { model: {}, formLoading: true }, });
      const response = await api.get('cancellation-models/load', { params: { id: data.id } });
      let model = _.get(response, 'data.model'),
        tags = _.get(response, 'data.tags');

      dispatch({ payload: { model, tags, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const createOrUpdate = async (model, actions) => {
    try {
      dispatch({ payload: { formLoading: true } });

      let editing = !!(model && model.id),
        method = editing ? 'put' : 'post',
        path = editing ? 'update' : 'create';

      await api[method](`cancellation-models/${path}`, model);

      mutate(data);

      showMessage('success', `Tipo de cancelamento ${editing ? 'atualizado' : 'criado'} com sucesso`);

      actions.toogleForm && actions.toogleForm();
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
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useCancellationModels;
