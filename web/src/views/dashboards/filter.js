import React from 'react';
import _ from 'lodash';
import { Row } from '~/components/layout';
import { getDate, lastDayOfMonth } from 'date-fns';
import { FilterContainer } from '~/views/dashboards/styles';
import { Autocomplete, Select, InputDate } from '~/components/form';

const getDays = (date) => {
  let maxDays = getDate(lastDayOfMonth(date));
  return _.times(maxDays, (n) => ({ label: `${n + 1}`, value: `${n + 1}` }));
};

export default function FormFilter({ values, setFieldValue, listTags }) {
  return (
    <FilterContainer>
      <Select
        name="dateField"
        label="Filtrar por"
        options={{ values: [
            { value: 'taxDate', label: 'Data de venda' },
            { value: 'refDate', label: 'Data de lançamento' },
            { value: 'dueDate', label: 'Data de vencimento' }
          ],
        }}
        />

      <Row span={3}>
        <InputDate
          name="baseDate"
          label="Mês"
          monthMode={true}
          onChange={(value) => {
            if (value) {
              setFieldValue('startDay', '1');
              setFieldValue('endDay', `${getDate(lastDayOfMonth(value))}`);
            }
          }}
          />

        <Select
          name="startDay"
          label="De"
          disabled={!values.baseDate}
          options={{
            values: getDays(values.baseDate)
          }}
          />

        <Select
          name="endDay"
          label="Até"
          disabled={!values.baseDate}
          options={{
            values: getDays(values.baseDate)
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
