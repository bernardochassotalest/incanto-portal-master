import { useEffect, useCallback } from 'react';
import _ from 'lodash';
import { showMessage, formats } from '~/helper';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import useHeader from '~/view-data/use-header';

const initialState = {
  loading: false,
  data: null,
  isOpenDetailModal: false,
  modalLoading: false,
  modalDetailLoading: false,
  modalData: null,
  movementData: []
};

const initialFilterState = {
  dateField: 'tax',
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date())
};

const prepareParams = (options) => {
  let params = _.cloneDeep(options);
  params.startDate = formats.dateTimeZone(options.startDate, 'yyyy-MM-dd');
  params.endDate = formats.dateTimeZone(options.endDate, 'yyyy-MM-dd');
  if (!_.isEmpty(options.tags)) {
    params.tags = _.map(options.tags, (o) => (_.isObject(o) === true) ? _.get(o, 'value', '') : o);
  }
  return params;
}

const findNodeById = (tree, id) => {
  const stack = [ tree ];
  while (stack.length) {
    const node = stack.shift();
    if (node.id === id) {
      return node;
    }
    node.children && stack.push(...node.children);
  }
  return null;
};

const getTreeFromArray = (array, root) => {
  let tree = { ...root, value: 0, children: [] };

  _.each(_.orderBy(array, ['level', 'order'], ['asc', 'asc']), (r) => {

    if (r.level === 1) {
      tree.children.push({ ...r, value: 0, father: root.id, children: [] })
    } else if (r.level > 1) {
      let parent = findNodeById(tree, r.father);

      if (parent) {
        parent.children.push({ ...r, children: [] })
      }
    }
  });
  return tree;
};

const treeSumLeafs = (node) => {
  node.value = 0;
  _.each(node.children, (child) => {
    node.value += treeSumLeafs(child);
  });
  node.value += _.sumBy(node.accounts, (r) => isNaN(r.value) ? 0 : r.value * 1);
  return node.value;
};

const prepareTitle = (filter) => {
  let text = 'Relatório';
  if (filter.startDate && filter.endDate) {
    text += ` (${formats.dateTimeZone(filter.startDate)} até ${formats.dateTimeZone(filter.endDate)})`;
  }
  return text;
};

const useReports = () => {
  const { state: { reports = initialState, reportsFilter = initialFilterState }, dispatch } = useGlobalContext(),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const generate = useCallback(async (params) => {
    try {
      dispatch({ type: 'reportsFilter', persistent: true, payload: params });
      headerActions.callFilter(params);
      if (_.isEmpty(params.template) || !params.startDate || !params.endDate) {
        return;
      }
      dispatch({ type: 'reports', payload: { data: {}, loading: true } });
      let response = await api.post('reports/generate', prepareParams(params)),
        data = response.data,
        rootName = _.get(params, 'template.name'),
        tree = getTreeFromArray(data, { id: 'root', name: rootName });

      treeSumLeafs(tree);
      dispatch({ type: 'reports', payload: { data: tree, loading: false } });
      headerActions.hideFilter();
    } catch (error) {
      failure(error, dispatch);
    }
    // eslint-disable-next-line
  }, [ dispatch ]);

  useEffect(() => {
    headerActions.hideFilter();
    headerActions.callFilter(reportsFilter);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    headerActions.configure({
      title: prepareTitle(headerState.filter.data)
    });
    // eslint-disable-next-line
  }, [headerState.filter.data]);


  useEffect(() => {
    let params = headerState.filter.data;
    if (!reports.data && !_.isEmpty(params.template) && params.startDate && params.endDate) {
      generate(params);
    }
    // eslint-disable-next-line
  }, [generate, headerState.filter.data]);

  const listTemplates = async (term, callback) => {
    try {
      const response = await api.get(`reports/list-templates`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listTags = async (term, callback) => {
    try {
      const response = await api.get(`reports/list-tags`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeDetailModal = () => {
    dispatch({ type: 'reports', payload: { isOpenDetailModal: false, modalData: {}, modalDetailLoading: false, movementData: [] }});
  };

  const openDetailModal = async (source) => {
    dispatch({type: 'reports', payload: { modalLoading: true, isOpenDetailModal: true }});
    try {
      let params = {
        ..._.pick(headerState.filter.data, 'dateField', 'startDate', 'endDate', 'tags'),
        ..._.pick(source, 'account')
      }
      let response = await api.get(`reports/account-movement`, { params: prepareParams(params) }),
        list = response.data;

      _.each(list, (r, index) => {
        r.id = index;
      });
      dispatch({ type: 'reports', payload: { modalLoading: false, modalData: { list, source } }});
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const exporToXlsx = async ({ source = {} }) => {
    dispatch({ type: 'reports', payload: { modalLoading: true } });

    let params = {
        ..._.pick(headerState.filter.data, 'dateField', 'startDate', 'endDate', 'tags'),
        ..._.pick(source, 'account')
      };

    try {
      let response = await api.get(`reports/export-details-xlsx`, { responseType: 'blob', params: prepareParams(params) }),
        filename = `lancamentos-${String(_.get(source, 'account')).replace(/\./g, '_')}-${format(new Date(), 'yyyyMMdd')}.xlsx`;
      api.download(response, filename);

      dispatch({ type: 'reports', payload: { modalLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const closeFilter = () => {
    headerActions.hideFilter();
  };

  return {
    state: {
      ...reports
    },
    actions: {
      generate,
      closeFilter,
      listTemplates,
      listTags,
      openDetailModal,
      closeDetailModal,
      exporToXlsx,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ type: 'reports', payload: { loading: false, modalDetailLoading: false, modalLoading: false }});
  showMessage('error', error);
};

export default useReports;
