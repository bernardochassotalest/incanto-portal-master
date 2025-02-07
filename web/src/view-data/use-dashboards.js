import { useEffect, useCallback } from 'react';
import _ from 'lodash';
import { showMessage, formats } from '~/helper';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import { lastDayOfMonth, setDate, getDate, add } from 'date-fns';
import useHeader from '~/view-data/use-header';

const initialState = {
  loading: false,
  showForm: false,
  term: null,
  data: null,
  modalData: null,
  isOpenBillsModal: false,
  isOpenSalesModal: false,
  isOpenVindiModal: false,
  isOpenJeErrorsModal: false,
  isOpenJeConciliedModal: false,
  isOpenMessagesModal: false,
  isOpenAcquirerModal: false,
  isOpenInvoicedModal: false,
  isOpenBillDetailModal: false,
  isOpenConciliationModal: false,
  billsFilter: {},
  billsList: {},
  vindiFilter: {},
  vindiList: {},
  jeErrorsFilter: {},
  jeErrorsList: {},
  jeConciliedFilter: {},
  jeConciliedList: {},
  messagesFilter: {},
  messagesList: {},
  salesFilter: {},
  salesList: {},
  invoicedList: {},
  billsDetail: {},
  salesModalTitle: '',
  vindiModalTitle: '',
  billsDetailTab: 'items',
  billsModalLoading: false,
  invoicedModalType: '',
  invoicedModalLoading: false,
  conciliationModalLoading: false,
  billDetailModalLoading: false,
  acquirerModalLoading: false,
  salesModalLoading: false,
  vindiModalLoading: false,
  jeErrorsModalLoading: false,
  jeConciliedModalLoading: false,
  messagesModalLoading: false,
  conciliationRulesList: [],
  conciliationTransactionList: [],
  conciliationModalSelection: [],
  acquirerModalData: {}
};

const initialFilterState = {
  dateField: 'taxDate',
  baseDate: new Date(),
  startDay: new Date().getDate().toString(),
  endDay: new Date().getDate().toString()
};

const prepareParams = (options) => {
  let params = {};
  params.dateField = _.get(options, 'dateField') || 'taxDate';
  params.startDate = options.startDate || formats.dateTimeZone(setDate(options.baseDate, options.startDay), 'yyyy-MM-dd');
  params.endDate = options.endDate || formats.dateTimeZone(setDate(options.baseDate, options.endDay), 'yyyy-MM-dd');
  if (!_.isEmpty(options.tags)) {
    params.tags = _.map(options.tags, (o) => (_.isObject(o) === true) ? _.get(o, 'value', '') : o);
  }
  return params;
}

const useDashboards = () => {
  const { state = initialState, dispatch } = useGlobalContext('dashboards'),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const load = useCallback(async (options) => {
    try {
      headerActions.callFilter(options);
      let params = prepareParams(options);
      params._ = new Date().getTime();
      dispatch({ payload: { data: null, loading: true } });
      let response = await api.post('dashboards/load', params);
      dispatch({ payload: { data: response.data, loading: false } });
      headerActions.hideFilter();
    } catch (error) {
      failure(error, dispatch);
    }
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    headerActions.callFilter(initialFilterState);
    load(initialFilterState);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let params = !_.isEmpty(headerState.filter.data) ? headerState.filter.data : initialFilterState;
    headerActions.configure({
      title: 'Dashboard'
    });
    if (!state.data && params.baseDate) {
      headerActions.callFilter(params);
      // load(params);
    }
    // eslint-disable-next-line
  }, [headerState.filter.data]);

  const hideFilter = (data) => {
    headerActions.hideFilter();
  };

  const filterByDay = (day, filter) => {
    if (day) {
      let params = _.cloneDeep(filter);
      params.startDay = day;
      params.endDay = day;
      load(params);
    }
  };

  const filterByMonth = (filter, next) => {
    if (filter) {
      let params = _.cloneDeep(filter);
      params.baseDate = add(params.baseDate, { months: (next) ? 1 : -1 });
      params.startDay = '1';
      params.endDay = `${getDate(lastDayOfMonth(params.baseDate))}`;
      load(params);
    }
  };

  const listTags = async (term, callback) => {
    try {
      const response = await api.get(`dashboards/list-tags`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const openConciliationModal = async (data) => {
    try {
      let params = { term: data.term, ...prepareParams(data) };
      const response = await api.get(`dashboards/conciliation-list-rules`, { params }),
        conciliationRulesList = response.data;
      dispatch({ payload: { isOpenConciliationModal: true, modalData: {}, conciliationModalSelection: [], conciliationRulesList } });
      if (!_.isEmpty(conciliationRulesList)) {
        let rule = _.first(conciliationRulesList);
        dispatch({ payload: { modalData: { rule } } });
        conciliationTransactions({ ...data, rule: _.get(rule, 'id', '') });
      }
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeConciliationModal = () => {
    dispatch({ payload: { isOpenConciliationModal: false, modalData: {}, conciliationModalSelection: [] } });
  };

  const openBillsModal = (params) => {
    dispatch({ payload: { isOpenBillsModal: true, billsList: {}, billsFilter: params } });
    listBills(params);
  };

  const closeBillsModal = () => {
    dispatch({ payload: { isOpenBillsModal: false, billsList: {} } });
  };

  const openVindiModal = (title, params) => {
    dispatch({ payload: { isOpenVindiModal: true, vindiModalTitle: title, vindiList: {}, vindiFilter: params } });
    listVindi(params);
  };

  const closeVindiModal = () => {
    dispatch({ payload: { isOpenVindiModal: false, vindiList: {} } });
  };

  const openJeErrorsModal = (params) => {
    dispatch({ payload: { isOpenJeErrorsModal: true, jeErrorsList: {}, jeErrorsFilter: params } });
    listJeErrors(params);
  };

  const closeJeErrorsModal = () => {
    dispatch({ payload: { isOpenJeErrorsModal: false, jeErrorsList: {} } });
  };

  const openJeConciliedModal = (params) => {
    dispatch({ payload: { isOpenJeConciliedModal: true, jeConciliedList: {}, jeConciliedFilter: params } });
    listJeConcilied(params);
  };

  const closeJeConciliedModal = () => {
    dispatch({ payload: { isOpenJeConciliedModal: false, jeConciliedList: {} } });
  };

  const openMessagesModal = (params) => {
    dispatch({ payload: { isOpenMessagesModal: true, messagesList: {}, messagesFilter: params } });
    listMessages(params);
  };

  const closeMessagesModal = () => {
    dispatch({ payload: { isOpenMessagesModal: false, messagesList: {} } });
  };

  const openSalesModal = (title, params) => {
    dispatch({ payload: { isOpenSalesModal: true, salesModalTitle: title, salesList: {}, salesFilter: params } });
    listSales(params);
  };

  const closeSalesModal = () => {
    dispatch({ payload: { isOpenSalesModal: false, salesList: {} } });
  };

  const openInvoicedModal = (params) => {
    const type = _.get(params, 'type', '');
    dispatch({ payload: { isOpenInvoicedModal: true, invoicedList: {}, invoicedModalType: type } });
    listInvoiced(params, type);
  };

  const closeInvoicedModal = () => {
    dispatch({ payload: { isOpenInvoicedModal: false, invoicedList: {} } });
  };

  const openBillDetailModal = async (data = {}) => {
    try {
      dispatch({ payload: { billsDetail: {}, billDetailModalLoading: true, isOpenBillDetailModal: true, billsDetailTab: 'items' } });

      const response = await api.get('dashboards/list-bills-details', { params: { saleId: data.id } });
      let billsDetail = response.data;
      dispatch({ payload: { billsDetail, billDetailModalLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeBillDetailModal = () => {
    dispatch({ payload: { billsDetail: {}, isOpenBillDetailModal: false } });
  };

  const changeBillsDetailTab = (billsDetailTab) => {
    dispatch({ payload: { billsDetailTab } });
  };

  const addConciliationSelection = (list, transactions, value) => {
    let found = _.find(list, _.pick(value, 'id'));

    if (!found) {
      let array = _.cloneDeep(list),
        transactionsCopy = _.cloneDeep(transactions);
      array.unshift(value);
      _.remove(transactionsCopy, value);
      dispatch({ payload: { conciliationModalSelection: array, conciliationTransactionList: transactionsCopy } });
    }
  };

  const removeConciliationSelection = (list, transactions, value) => {
    let array = _.cloneDeep(list),
      transactionsCopy = _.cloneDeep(transactions);
    transactionsCopy.unshift(value);
    _.remove(array, value);
    dispatch({ payload: { conciliationModalSelection: array, conciliationTransactionList: transactionsCopy } });
  };

  const conciliationJoin = async (params, filter) => {
    try {
      dispatch({ payload: { conciliationModalLoading: true } });
      await api.post(`dashboards/conciliation-join`, params);

      dispatch({ payload: { conciliationModalLoading: false, conciliationModalSelection: [] } });
      showMessage('success', `Conciliação efetuada com sucesso`);
      conciliationTransactions(filter);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const conciliationCreate = async (params, filter, avoidRefresh = false) => {
    try {
      dispatch({ payload: { conciliationModalLoading: true } });
      const { message = '', ...others } = params;
      await api.post(`dashboards/conciliation-create`, others);

      dispatch({ payload: { conciliationModalLoading: false, conciliationModalSelection: [] } });
      showMessage('success', `Conciliação efetuada com sucesso${message}`);
      if (!avoidRefresh) conciliationTransactions(filter);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const conciliationTransactions = async (data) => {
    try {
      dispatch({ payload: { conciliationModalLoading: true } });

      let params = { rule: data.rule, ...prepareParams(data) };

      let response = await api.get(`dashboards/conciliation-list-transactions`, { params }),
        conciliationTransactionList = response.data;

      dispatch({ payload: { conciliationModalLoading: false, conciliationTransactionList, conciliationModalSelection: [] } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listBills = async (data) => {
    try {
      dispatch({ payload: { billsModalLoading: true } });

      let params = { offset: data.offset || 0, ...data };

      let response = await api.get(`dashboards/list-bills`, { params }),
        billsList = response.data;

      dispatch({ payload: { billsModalLoading: false, billsList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listSales = async (data) => {
    try {
      dispatch({ payload: { salesModalLoading: true } });

      let params = { offset: data.offset || 0, ...data };

      let response = await api.get(`dashboards/list-sales`, { params }),
        salesList = response.data;

      dispatch({ payload: { salesModalLoading: false, salesList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listVindi = async (data) => {
    try {
      dispatch({ payload: { vindiModalLoading: true } });

      let params = { offset: data.offset || 0, ...data };

      let response = await api.get(`dashboards/list-vindi`, { params }),
        vindiList = response.data;

      dispatch({ payload: { vindiModalLoading: false, vindiList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listJeErrors = async (data) => {
    try {
      dispatch({ payload: { jeErrorsModalLoading: true } });

      let params = { offset: data.offset || 0, ...data };

      let response = await api.get(`dashboards/list-je-errors`, { params }),
        jeErrorsList = response.data;

      dispatch({ payload: { jeErrorsModalLoading: false, jeErrorsList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const resendJE = async (params, filter) => {
    try {
      dispatch({ payload: { jeErrorsModalLoading: true } });
      await api.post(`dashboards/je-resend`, params);

      dispatch({ payload: { jeErrorsModalLoading: false, jeErrorsList: {} } });
      showMessage('success', `Lançamento Contábil reenviado para o SAP Business One`);
      listJeErrors(filter);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listJeConcilied = async (data) => {
    try {
      dispatch({ payload: { jeConciliedModalLoading: true } });

      let params = { offset: data.offset || 0, ...data };

      let response = await api.get(`dashboards/list-je-not-concilied`, { params }),
        jeConciliedList = response.data;

      dispatch({ payload: { jeConciliedModalLoading: false, jeConciliedList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listMessages = async (data) => {
    try {
      dispatch({ payload: { messagesModalLoading: true } });

      let params = { offset: data.offset || 0, ...data };

      let response = await api.get(`dashboards/list-messages`, { params }),
        messagesList = response.data;

      dispatch({ payload: { messagesModalLoading: false, messagesList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const confirmMessages = async (params, filter) => {
    try {
      dispatch({ payload: { messagesModalLoading: true } });
      await api.post(`dashboards/confirm-messages`, params);

      dispatch({ payload: { messagesModalLoading: false, messagesList: {} } });
      showMessage('success', `Mensagem de validação confirmada`);
      listMessages(filter);
    } catch (error) {
      failure(error, dispatch);
    }
  }

  const listInvoiced = async (data, type) => {
    try {
      dispatch({ payload: { invoicedModalLoading: true } });

      let params = { offset: data.offset || 0, ...prepareParams(data) }, route = '';

      if (type === 'notCaptured') {
        route = 'list-not-captured';
      } else if (type === 'sale') {
        route = 'list-invoiced';
      } else if (type === 'creditCard') {
        route = 'list-creditcard';
      } else if (type === 'slip') {
        route = 'list-slip';
      } else if (type === 'directDebit') {
        route = 'list-direct-debit';
      } else if (type === 'pecld') {
        route = 'list-pecld';
      }

      let response = await api.get(`dashboards/${route}`, { params }),
        invoicedList = response.data;

      dispatch({ payload: { invoicedModalLoading: false, invoicedList } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const openAcquirerModal = async (title, params) => {
    dispatch({ payload: { isOpenAcquirerModal: true, acquirerModalLoading: true, acquirerModalData: {}, title: '' } });
    try {
      let response = await api.get(`dashboards/list-acquirers`, { params }),
        acquirerModalData = { title, ...response.data };

      dispatch({ payload: { acquirerModalLoading: false, acquirerModalData } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeAcquirerModal = () => {
    dispatch({ payload: { isOpenAcquirerModal: false, acquirerModalData: {} } });
  };

  const exportSummaryPdf = async (params) => {
    try {
      let filename = `resumo-contabil-${formats.dateTimeZone(params.startDate, 'ddMMyyyy')}-${formats.dateTimeZone(params.endDate, 'ddMMyyyy')}.pdf`;
      dispatch({ payload: { loading: true } });
      let response = await api.get(`dashboards/export-summary-pdf`, { params, responseType: 'blob' });
      api.download(response, filename);
      dispatch({ payload: { loading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  return {
    state: {
      ...state,
      filter: headerState.filter
    },
    actions: {
      load,
      listTags,
      hideFilter,
      filterByDay,
      filterByMonth,
      conciliationJoin,
      conciliationCreate,
      conciliationTransactions,
      listBills,
      listSales,
      listVindi,
      listJeErrors,
      listJeConcilied,
      listMessages,
      listInvoiced,
      openBillsModal,
      openSalesModal,
      openVindiModal,
      openJeErrorsModal,
      openJeConciliedModal,
      openMessagesModal,
      openInvoicedModal,
      openConciliationModal,
      closeConciliationModal,
      closeBillsModal,
      closeSalesModal,
      closeVindiModal,
      closeJeErrorsModal,
      closeJeConciliedModal,
      closeMessagesModal,
      closeInvoicedModal,
      resendJE,
      confirmMessages,
      addConciliationSelection,
      removeConciliationSelection,
      openAcquirerModal,
      closeAcquirerModal,
      exportSummaryPdf,
      openBillDetailModal,
      changeBillsDetailTab,
      closeBillDetailModal
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false, billsModalLoading: false, invoicedModalLoading: false, acquirerModalLoading: false, conciliationModalLoading: false } });
  showMessage('error', error);
};

export default useDashboards;
