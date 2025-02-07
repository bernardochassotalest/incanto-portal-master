import { useEffect, useCallback } from 'react';
import _ from 'lodash';
import { endOfMonth, startOfMonth, format, isValid  } from 'date-fns';
import { showMessage } from '~/helper';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import useHeader from '~/view-data/use-header';

const initialState = {
  loading: false,
  showForm: false,
  modalLoading: false,
  isDetailModalOpen: false,
  term: null,
  offset: 0,
  model: null,
  detailTab: 'items',
  data: { rows: [], count: 0, offset: 0 },
};

const initialFilterState = {
  type: 'period',
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date())
};

const useSales = () => {
  const { state = initialState, dispatch } = useGlobalContext('sales'),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const list = useCallback(async (offset, opts) => {
    let params = _.cloneDeep(opts);
    params.offset = offset;
    if (params.type === 'customerId') {
      params.term = _.get(params, 'customer.id');
      _.unset(params, 'customer');
    }
    if (params.type === 'itemCode') {
      params.term = _.get(params, 'product.id');
      _.unset(params, 'product');
    }
    if (isValid(params.startDate)) {
      params.startDate = format(params.startDate, 'yyyy-MM-dd');
    }
    if (isValid(params.endDate)) {
      params.endDate = format(params.endDate, 'yyyy-MM-dd');
    }
    try {
      headerActions.callFilter(opts);
      dispatch({ payload: { data: { rows: [], count: 0, offset: 0 }, loading: true } });
      let response = await api.post('sales/list', params);
      dispatch({ payload: { data: response.data, loading: false } });
      headerActions.hideFilter();
    } catch (error) {
      failure(error, dispatch);
    }
    // eslint-disable-next-line
  }, [ dispatch ]);

  useEffect(() => {
    list(0, initialFilterState);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let params = !_.isEmpty(headerState.filter.data) ? headerState.filter.data : initialFilterState;
    if (params.type) {
      list(0, params);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    headerActions.configure({
      title: 'Vendas',
      count: _.get(state, 'data.count', 0),
      loading: false
    });
    // eslint-disable-next-line
  }, [state.data.count]);

  const pageChange = (offset = 0) => {
    list(offset, headerState.filter.data);
  };

  const hideForm = async () => {
    dispatch({ payload: { model: {}, showForm: false }});
    headerActions.hideFilter();
  };

  const changeFilter = (data) => {
    dispatch({ payload: { model: {}, showForm: false }});
    headerActions.callFilter(data);
    list(0, data);
  };

  const openModalDetail = async (data = {}) => {
    try {
      dispatch({ payload: { model: {}, modalLoading: true, isDetailModalOpen: true, detailTab: 'items' }});

      const response = await api.get('sales/list-details', { params: { saleId: data.id } });
      let model = response.data;
      dispatch({ payload: { model, modalLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeModalDetail = () => {
    dispatch({ payload: { model: {}, isDetailModalOpen: false }});
  };

  const changeDetailTab = (detailTab) => {
    dispatch({ payload: { detailTab }});
  };

  const listCustomers = async (term, callback) => {
    try {
      const response = await api.get(`sales/list-customers`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listProducts = async (term, callback) => {
    try {
      const response = await api.get(`sales/list-products`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  return {
    state: {
      ...state
    },
    actions: {
      pageChange,
      openModalDetail,
      closeModalDetail,
      list,
      hideForm,
      changeFilter,
      listCustomers,
      listProducts,
      changeDetailTab,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, modalLoading: false }});
  showMessage('error', error);
};

export default useSales;
