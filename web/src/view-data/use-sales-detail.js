import { useEffect, useCallback } from 'react';
import { showMessage } from '~/helper';
import _ from 'lodash';
import { formats } from '~/helper';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import useHeader from '~/view-data/use-header';
import { useParams } from 'react-router-dom';

const initialState = {
  loading: false,
  model: null,
  detailTab: 'items'
};

const useSalesDetail = () => {
  const { id } = useParams(),
    { state = initialState, dispatch } = useGlobalContext('salesDetail'),
    { actions: headerActions } = useHeader({ useFilter: false });

  const load = useCallback(async (saleId) => {
    let params = { saleId };

    try {
      dispatch({ payload: { model: {}, loading: true, detailTab: 'items' } });
      let response = await api.get('sales/list-details', { params }),
        model = response.data;
      dispatch({ payload: { model, loading: false } });

      headerActions.configure({
        title: `Detalhe da Venda - Cliente ${formats.cnpj_cpf(_.get(model, 'header.customer.vatNumber'))}`
      });
    } catch (error) {
      failure(error, dispatch);
    }
    // eslint-disable-next-line
  }, [ dispatch ]);

  useEffect(() => {
    headerActions.configure({
      title: 'Detalhe da Venda'
    });
    if (id) {
      load(id);
    }
    // eslint-disable-next-line
  }, []);

  const changeDetailTab = (detailTab) => {
    dispatch({ payload: { detailTab }});
  };

  return {
    state: {
      ...state
    },
    actions: {
      changeDetailTab
    }
  };
};

const failure = (error, dispatch) => {
  dispatch({ payload: { loading: false }});
  showMessage('error', error);
};

export default useSalesDetail;
