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
  selected: null,
  isDetailModalOpen: false,
  billsDetail: {},
  billDetailModalLoading: false,
  isOpenBillDetailModal: false,
  billsDetailTab: 'items',
  modalLoading: false,
  data: { rows: [], count: 0, offset: 0 },
};

const getParams = (data) => {
  return { ..._.omit(data, 'customer'), customerId: _.get(data, 'customer.id') };
};

const useCustomerCredits = () => {
  const { state = initialState, dispatch } = useGlobalContext('customerCredits'),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const { data } = useFetch({
    url: 'customer-credits/list',
    method: 'POST',
    params: { ...getParams(_.get(headerState, 'filter.data')), offset: state.offset || 0 }
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Créditos de Clientes',
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

  const listCustomers = async (term, callback) => {
    try {
      const response = await api.get(`customer-credits/list-customers`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const openModalDetail = async (data = {}) => {
    try {
      dispatch({ payload: { selected: data, model: {}, modalLoading: true, isDetailModalOpen: true, detailTab: 'items' }});

      const response = await api.get('customer-credits/list-details', { params: { customerId: data.id } });
      let model = response.data;
      dispatch({ payload: { model, modalLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeModalDetail = () => {
    dispatch({ payload: { model: {}, selected: {}, isDetailModalOpen: false }});
  };

  const openBillDetailModal = async (data = {}) => {
    try {
      dispatch({ payload: { billsDetail: {}, billDetailModalLoading: true, isOpenBillDetailModal: true, billsDetailTab: 'items' }});

      const response = await api.get('customer-credits/list-bills-details', { params: { saleId: data.id } });
      let billsDetail = response.data;
      dispatch({ payload: { billsDetail, billDetailModalLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeBillDetailModal = () => {
    dispatch({ payload: { billsDetail: {}, isOpenBillDetailModal: false }});
  };

  const changeBillsDetailTab = (billsDetailTab) => {
    dispatch({ payload: { billsDetailTab }});
  };


  return {
    state: {
      ...state,
      data: data || {},
      loading: !data,
    },
    actions: {
      pageChange,
      list,
      hideForm,
      changeFilter,
      listCustomers,
      openModalDetail,
      closeModalDetail,
      openBillDetailModal,
      changeBillsDetailTab,
      closeBillDetailModal,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useCustomerCredits;
