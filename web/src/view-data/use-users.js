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

const useUsers = () => {
  const { state = initialState, dispatch } = useGlobalContext('users'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const { data, mutate } = useFetch({
    url: 'users/list',
    params: { term: state.term, offset: state.offset },
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Usuários',
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
      let model = { active: true };

      if (data.id) {
        const response = await api.get('users/load', { params: { id: data.id } });
        model = response.data;
      }
      dispatch({ payload: { model, formLoading: false } });
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

      await api[method](`users/${path}`, model);

      mutate(data);

      showMessage('success', `Usuário ${editing ? 'atualizado' : 'criado'} com sucesso`);

      actions.toogleForm && actions.toogleForm();
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const resetPassword = async (data, actions) => {
    try {
      await api.put(`users/reset-password`, data);
      showMessage('success', `Senha redefinida com sucesso`);
      actions.setSubmitting(false);
    } catch (error) {
      actions.setSubmitting(false);
      failure(error, dispatch);
    }
  };

  const listProfiles = async (term, callback) => {
    try {
      const response = await api.get(`users/list-profiles`, { params: { term } });
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
      resetPassword,
      listProfiles
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useUsers;
