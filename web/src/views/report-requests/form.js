import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import { Row } from '~/components/layout';
import { Autocomplete, InputDate } from '~/components/form';
import { FormContainer } from '~/views/report-requests/styles';

export const ReportRequestsForm = ({ errors, touched, listReportTypes, values, previewMode, setFieldValue }) => {

  return (
    <FormContainer>
      <Autocomplete
        name="type"
        minLength={0}
        keyField="id"
        label="Tipo do Relatório"
        value={_.get(values, 'type', '')}
        disabled={previewMode}
        valueFormat={row => `${row.name}`}
        loadData={listReportTypes}
        emptyText={"Pesquise um tipo de relatório"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.type && touched.type}
      />

      <Row span={2}>
        <InputDate
          name="startDate"
          label="Data início"
          onChange={(value) => {
            if (!isBefore(value, values.endDate)) {
              setFieldValue('startDate', values.endDate);
              setFieldValue('endDate', value)
            }
          }}
          />

        <InputDate
          name="endDate"
          label="Data término"
          onChange={(value) => {
            if (isBefore(value, values.startDate)) {
              setFieldValue('startDate', value);
              setFieldValue('endDate', values.startDate);
            }
          }}
          />
      </Row>

    </FormContainer>
  );
};

export const ReportRequestsSchema = Yup.object().shape({
  type: Yup.string().required('Informe o tipo do relatório'),
  startDate: Yup.string().required('Informe a data de início'),
  endDate: Yup.string().required('Informe a data de término')
});
