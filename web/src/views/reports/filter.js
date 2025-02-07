import React from 'react';
import { isBefore } from 'date-fns';
import { FilterContainer } from '~/views/reports/styles';
import { Row } from '~/components/layout';
import { Select, Autocomplete, InputDate } from '~/components/form';

export default function FormFilter({ values, setFieldValue, listTemplates, listTags }) {
  return (
    <FilterContainer>
      <Autocomplete
        name="template"
        minLength={0}
        keyField="id"
        label="Modelo do relatório"
        value={values.template}
        valueFormat={row => `${row.name}`}
        loadData={listTemplates}
        emptyText={"Pesquise um modelo"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        />

      <Row span={3}>
        <Select
          name="dateField"
          label="Filtrar por"
          options={{ values: [
              { value: 'tax', label: 'Data de venda' },
              { value: 'ref', label: 'Data de lançamento' },
              { value: 'due', label: 'Data de vencimento' }
            ],
          }}
          />

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
          label="Data fim"
          onChange={(value) => {
            if (isBefore(value, values.startDate)) {
              setFieldValue('startDate', value);
              setFieldValue('endDate', values.startDate);
            }
          }}
          />
      </Row>

      <Autocomplete
        name="tags"
        minLength={0}
        keyField="tag"
        keyApp={`tags`}
        label="Tags"
        value={values.tags}
        multiple={true}
        valueFormat={row => `${row.tag}`}
        loadData={listTags}
        emptyText={"Selecione uma Tag"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrada"}
        />
    </FilterContainer>
  );
};
