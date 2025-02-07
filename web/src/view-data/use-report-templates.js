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
  isOpenAccountModal: false,
  term: null,
  offset: 0,
  model: null,
  modalData: {},
  data: { rows: [], count: 0, offset: 0 },
};

const useReportTemplates = () => {
  const { state = initialState, dispatch } = useGlobalContext('report-templates'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const { data, mutate } = useFetch({
    url: 'report-templates/list',
    params: { term: state.term, offset: state.offset },
  });

  useEffect(() => {
    headerActions.configure({
      title: 'Modelos de Relatórios',
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
        const response = await api.get('report-templates/load', { params: { id: data.id } });
        model = response.data;
      }
      let sortedTree = getTreeFromArray(model.items || [], { id: 'root', name: 'root' });
      model.items = getArrayFromTree(sortedTree).slice(1);

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

      await api[method](`report-templates/${path}`, model);

      mutate(data);

      showMessage('success', `Modelo de relatório ${editing ? 'atualizado' : 'criado'} com sucesso`);

      actions.toogleForm && actions.toogleForm();
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listTags = async (term, callback) => {
    try {
      const response = await api.get(`report-templates/list-tags`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listAccounts = async (term, callback) => {
    try {
      const response = await api.get(`report-templates/list-accounts`, { params: { term } });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

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
    let tree = { ...root, children: [] };

    _.each(_.orderBy(array, ['level', 'order'], ['asc', 'asc']), (r) => {

      if (r.level === 1) {
        tree.children.push({ ...r, father: root.id, children: [] })
      } else if (r.level > 1) {
        let parent = findNodeById(tree, r.father);

        if (parent) {
          parent.children.push({ ...r, children: [] })
        }
      }
    });
    return tree;
  };

  const getArrayFromTree = (root) => {
    let stack = [], array = [], hashMap = {};
    stack.push(root);

    while(stack.length !== 0) {
      let node = stack.pop();
      if (!hashMap[node.id]) {
        hashMap[node.id] = true;
        array.push(_.omit(node, 'children'));
      }
      if (!_.isEmpty(node.children)) {
        for(let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }
    return array;
  };

  const findChildTreeIds = (array, node) => {
    let ids = [ ],
      startIndex = -1;

    _.each(array, (item, index) => {
      if (startIndex === -1 && item.id === node.id) {
        startIndex = index;
        ids.push(item.id);
      }

      if (startIndex >= 0 && item.level > node.level) {
        ids.push(item.id);
      }
      if (startIndex >= 0 && item.level === node.level) {
        return;
      }
    });

    return ids;
  };

  const updateTree = (values, array) => {
    let sortedTree = getTreeFromArray(array, { id: 'root', name: 'root' });
    let items = getArrayFromTree(sortedTree).slice(1);
    dispatch({ payload: { model: { ...values, items } } });
  };

  const handleAccountModalClose = () => {
    dispatch({ payload: { isOpenAccountModal: false, modalData: {} }});
  };

  const handleAccountModalOpen = (modalData) => {
    dispatch({ payload: { isOpenAccountModal: true, modalData }});
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
      listTags,
      listAccounts,
      getTreeFromArray,
      getArrayFromTree,
      updateTree,
      findChildTreeIds,
      handleAccountModalClose,
      handleAccountModalOpen,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false }});
  showMessage('error', error);
};

export default useReportTemplates;
