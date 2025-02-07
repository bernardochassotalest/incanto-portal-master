import _ from "lodash";
import { useEffect } from "react";
import { showMessage } from "~/helper";
import api from "~/services/api";
import useGlobalContext from "~/view-data/use-global-context";
import useFetch from "~/view-data/use-fetch";
import useHeader from "~/view-data/use-header";

const initialState = {
  loading: false,
  showForm: false,
  formLoading: false,
  term: null,
  offset: 0,
  model: null,
  data: { rows: [], count: 0, offset: 0 }
};

const useSourceMappings = () => {
  const { state = initialState, dispatch } = useGlobalContext("acquirers"),
    { state: headerState, actions: headerActions } = useHeader({ useFilter: true });

  const { data, mutate } = useFetch({
    url: "source-mappings/list",
    params: { ..._.get(headerState, 'filter.data'), offset: state.offset || 0 }
  });

  useEffect(() => {
    headerActions.configure({
      title: "Mapeamento das Fontes de Dados",
      count: _.get(data, "count", 0),
      loading: _.get(state, "loading", false)
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

  const load = async (data = {}) => {
    try {
      dispatch({ payload: { model: _.pick(data, 'source'), showForm: true, formLoading: true } });
      let model = {};

      if (data.id) {
        const response = await api.get("source-mappings/load", {
          params: { id: data.id }
        });
        model = response.data;
      }
      dispatch({ payload: { model, formLoading: false } });
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const listSourceItems = async (term, sourceId, callback) => {
    try {
      const response = await api.get(`source-mappings/list-source-items`, {
        params: { term, sourceId }
      });
      callback(response.data);
    } catch (error) {
      failure(error, dispatch);
    }
  };

  const update = async (model, actions) => {
    try {
      dispatch({ payload: { formLoading: true } });
      await api.put('source-mappings/update', model);
      mutate(data);
      showMessage('success', 'Configuração Contábil atualizada com sucesso');
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
      load,
      hideForm,
      changeFilter,
      list,
      listSourceItems,
      update,
    }
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false, formLoading: false } });
  showMessage("error", error);
};

export default useSourceMappings;
