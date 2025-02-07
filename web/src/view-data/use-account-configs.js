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
  data: { rows: [], count: 0, offset: 0 }
};

const useAccountConfig = () => {
  const { state = initialState, dispatch } = useGlobalContext('accountConfigs'),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const prepareParams = (options) => {
    let params = {};
    params['model'] = _.get(options, 'accountingModel.id', '');
    params['source'] = _.get(options, 'dataSource.id', '');
    params['item'] = _.get(options, 'sourceItem.id', '');
    return params;
  }

  const { data, mutate } = useFetch({
    url: 'account-configs/list',
    params: { ...prepareParams(_.get(headerState, 'filter.data')), offset: state.offset || 0 }
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Configuração Contábil',
      count: _.get(data, 'count', 0),
      loading: _.get(state, 'loading', false),
    });
    // eslint-disable-next-line
  }, [data, state]);

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
      dispatch({ payload: { model:  _.pick(data, 'dataSource', 'debChartOfAccount', 'credChartOfAccount'), showForm: true, formLoading: true } });
      let model = {};

      if (data.id) {
        const response = await api.get('account-configs/load', { params: { id: data.id } });
        model = response.data;
      }
      dispatch({ payload: { model, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listAccountModels = async (term, callback) => {
    try {
      const response = await api.get(`account-configs/list-models`, {
        params: { term }
      });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listDataSources = async (term, callback) => {
    try {
      const response = await api.get(`account-configs/list-sources`, {
        params: { term }
      });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listSourceItems = async (term, dataSource, callback) => {
    try {
      let sourceId = _.get(dataSource, 'id');
      const response = await api.get(`account-configs/list-source-items`, { params: { term, sourceId }});
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listChartOfAccounts = async (term, callback) => {
    try {
      const response = await api.get(`account-configs/list-chart-of-accounts`, {
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
      const response = await api.get(`account-configs/list-business-partners`, {
        params: { term, grpCode }
      });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listCostingCenters = async (term, callback) => {
    try {
      const response = await api.get(`account-configs/list-costing-centers`, {
        params: { term }
      });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listProjects = async (term, callback) => {
    try {
      const response = await api.get(`account-configs/list-projects`, {
        params: { term }
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

      await api[method](`account-configs/${path}`, model);
      mutate(data);
      showMessage('success', `Configuração Contábil ${editing ? 'atualizada' : 'criada'} com sucesso`);

      dispatch({ payload: { formLoading: false, showForm: false } });

      actions.toogleForm && actions.toogleForm();
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const remove = async (model, actions) => {
    try {
      let params = model;
      dispatch({ payload: { formLoading: true } });
      await api['delete']('account-configs/remove', {params});
      mutate(data);
      showMessage('success', `Configuração Contábil removido com sucesso`);
      dispatch({ payload: { formLoading: false, showForm: false } });
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
      hideForm,
      changeFilter,
      load,
      listAccountModels,
      listDataSources,
      listSourceItems,
      listChartOfAccounts,
      listBusinessPartners,
      listCostingCenters,
      listProjects,
      createOrUpdate,
      remove,
    }
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false } });
  showMessage('error', error);
};

export default useAccountConfig;
