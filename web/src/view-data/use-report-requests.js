import _ from 'lodash';
import { format } from 'date-fns';
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
  model: {},
  openForm: false,
  data: { rows: [], count: 0, offset: 0 },
};

const useReportRequests = () => {
  const { state = initialState, dispatch } = useGlobalContext('report-requests'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const { data, mutate } = useFetch({
    url: 'report-requests/list',
    params: { term: state.term, offset: state.offset },
  }, { refreshInterval: 2500 });

  useEffect(() => {
    headerActions.configure({
      title: 'Exportação de Dados em Planilha do Excel',
      count: _.get(data, 'count', 0),
      loading: _.get(state, 'loading', false),
      onSearch: null,
    });
    // eslint-disable-next-line
  }, [data, state]);

  const list = (offset = 0, term) => {
    dispatch({ payload: { offset, term } });
  };

  const pageChange = (offset = 0) => {
    dispatch({ payload: { offset } });
  };

  const closeForm = async (params) => {
    dispatch({ payload: { openForm: false } });
  };

  const load = async (params) => {
    dispatch({ payload: { model: {}, openForm: _.isEmpty(params) } });
  };

  const create = async (model, actions) => {
    dispatch({ payload: { formLoading: true } });

    try {
      let params = {
          typeId: _.get(model, 'type.id', ''),
          startDate: format(_.get(model, 'startDate', ''), 'yyyy-MM-dd'),
          endDate: format(_.get(model, 'endDate', ''), 'yyyy-MM-dd')
        };
      await api.post(`report-requests/create`, params);
      mutate(data);

      showMessage('success', `Solicitação de relatório criada com sucesso`);
      actions.toogleForm && actions.toogleForm();
      dispatch({ payload: { formLoading: false, openForm: false, model: {} } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const handleDownload = async (id, typeId) => {
    dispatch({ payload: { loading: true } });

    try {
      let response = await api.get(`report-requests/export-xlsx`, { responseType: 'blob', params: { id } }),
        filename = `${typeId}-${format(new Date(), 'yyyyMMdd-HHmmss')}.xlsx`;
      api.download(response, filename);

      dispatch({ payload: { loading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listReportTypes = async (term, callback) => {
    try {
      const response = await api.get(`report-requests/list-report-types`, {
        params: { term }
      });
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
      create,
      handleDownload,
      listReportTypes,
      closeForm
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useReportRequests;
