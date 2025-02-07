import React from 'react';
import { isBefore } from 'date-fns';
import { FilterContainer } from '~/views/sales-cancellation/styles';
import { Row } from '~/components/layout';
import { InputDate, Autocomplete, Select } from '~/components/form';

export default function FormFilter({ values, setFieldValue, listUsers }) {
  return (
    <FilterContainer>

      <Autocomplete
        name="user"
        minLength={0}
        keyField="id"
        label="Autor da justificativa"
        value={values.user}
        valueFormat={row => `${row.name}`}
        loadData={listUsers}
        emptyText={"Pesquise um usuário"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        />

      <Select
        name="hasJustify"
        label="Com justificativa?"
        options={{
          values: [
            { value: '', label: 'Todos' },
            { value: 'true', label: 'Sim' },
            { value: 'false', label: 'Não' }
          ],
        }}
        />

      <Row span={2}>
        <InputDate
          name="refDateStart"
          label="Data de referência início"
          onChange={(value) => {
            if (!isBefore(value, values.refDateEnd)) {
              setFieldValue('refDateStart', values.refDateEnd);
              setFieldValue('refDateEnd', value)
            }
          }}
          />

        <InputDate
          name="refDateEnd"
          label="Data de referência fim"
          onChange={(value) => {
            if (isBefore(value, values.refDateStart)) {
              setFieldValue('refDateStart', value);
              setFieldValue('refDateEnd', values.refDateStart);
            }
          }}
          />
      </Row>

      <Row span={2}>
        <InputDate
          name="dueDateStart"
          label="Data de vencimento início"
          onChange={(value) => {
            if (!isBefore(value, values.dueDateEnd)) {
              setFieldValue('dueDateStart', values.dueDateEnd);
              setFieldValue('dueDateEnd', value)
            }
          }}
          />

        <InputDate
          name="dueDateEnd"
          label="Data de vencimento fim"
          onChange={(value) => {
            if (isBefore(value, values.dueDateStart)) {
              setFieldValue('dueDateStart', value);
              setFieldValue('dueDateEnd', values.dueDateStart);
            }
          }}
          />
      </Row>

    </FilterContainer>
  );
};
