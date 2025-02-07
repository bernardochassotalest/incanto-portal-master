import React from 'react';
import _ from 'lodash';
import { BusinessPartnerTypesMapping } from '~/constants';
import { FilterContainer } from '~/views/sales-cancellation/styles';
import { InputGroup, Autocomplete, Select } from '~/components/form';

export default function FormFilter({ values, setFieldValue, listGroups }) {
  return (
    <FilterContainer>
      <InputGroup
        type="text"
        name="cardName"
        label="Nome"
        />

      <InputGroup
        type="text"
        name="vatNumber"
        label="CNPJ/CPF"
        />

      <Select
        name="type"
        label="Tipo"
        options={{
          values: [
            { value: '', label: 'Todos' },
            ..._.map(BusinessPartnerTypesMapping, (label, value) => ({ value, label }))
          ],
        }}
        />

      <Autocomplete
        name="group"
        minLength={0}
        keyField="id"
        label="Grupo"
        value={values.group}
        valueFormat={row => `${row.grpName}`}
        loadData={listGroups}
        emptyText={"Pesquise um grupo"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        />
    </FilterContainer>
  );
};
