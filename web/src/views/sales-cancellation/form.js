import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { Autocomplete, TextArea } from '~/components/form';
import { FormContainer } from '~/views/sales-cancellation/styles';

export const SaleCancellationForm = ({ errors, touched, values, previewMode, setFieldValue, listCancellationTypes }) => {

  return (
    <FormContainer>
      <Autocomplete
        name="model"
        minLength={0}
        keyField="id"
        label="Tipo de Cancelamento"
        value={values.model}
        valueFormat={row => `${row.name}`}
        loadData={listCancellationTypes(values.saleTag)}
        emptyText={"Pesquise um tipo de cancelamento"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        />

      <TextArea
        type='text'
        name='notes'
        label='Motivo'
        rows={5}
        value={values.notes || ''}
        maxLength={200}
        disabled={previewMode}
        hasError={errors.notes && touched.notes}
        />

    </FormContainer>
  );
};

export const SaleCancellationSchema = Yup.object().shape({
  notes: Yup.string().required('Informe o motivo'),
  model: Yup.mixed().test("", "Informe o tipo de Cancelamento", function(val) {
    return !_.isEmpty(val);
  })
});
