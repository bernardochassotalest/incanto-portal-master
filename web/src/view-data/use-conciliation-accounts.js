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
  data: { rows: [], count: 0, offset: 0 }
};

const useConciliationAccounts = () => {
  const { state = initialState, dispatch } = useGlobalContext('conciliationAccounts'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const { data, mutate } = useFetch({
    url: 'conciliation-accounts/list',
    params: { term: state.term, offset: state.offset }
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Conciliação Contábil no SAP B1',
      count: _.get(data, 'count', 0),
      loading: _.get(state, 'loading', false),
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
      dispatch({ payload: { model:  _.pick(data, 'chartOfAccount', 'type'), formLoading: true } });
      let model = {};

      if (data.id) {
        const response = await api.get('conciliation-accounts/load', { params: { id: data.id } });
        model = response.data;
      }
      dispatch({ payload: { model, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listChartOfAccounts = async (term, callback) => {
    try {
      const response = await api.get(`conciliation-accounts/list-chart-of-accounts`, {
        params: { term }
      });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listBusinessPartners = async (term, debAccount, callback) => {
    try {
      const grpCode = _.get(debAccount, 'group');
      const response = await api.get(`conciliation-accounts/list-business-partners`, {
        params: { term, grpCode }
      });
      callback(response.data);
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

      if (_.isEmpty(_.get(model, 'type')) === true) {
        model['type'] = 'account';
      }

      await api[method](`conciliation-accounts/${path}`, model);
      mutate(data);
      showMessage('success', `Configuração ${editing ? 'atualizada' : 'criada'} com sucesso`);

      actions.toogleForm && actions.toogleForm();
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const remove = async (model, actions) => {
    try {
      let params = model;
      dispatch({ payload: { formLoading: true } });
      await api['delete']('conciliation-accounts/remove', {params});
      mutate(data);
      showMessage('success', `Configuração removido com sucesso`);
      actions.toogleForm && actions.toogleForm();
    } catch (error) {
      failure(error, dispatch);
    }
  };

  return {
    state: {
      ...state,
      data: data || {},
      loading: !data
    },
    actions: {
      pageChange,
      load,
      list,
      listChartOfAccounts,
      listBusinessPartners,
      createOrUpdate,
      remove,
    }
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false } });
  showMessage('error', error);
};

export default useConciliationAccounts;
