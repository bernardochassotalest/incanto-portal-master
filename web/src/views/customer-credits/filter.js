import React from 'react';
import { Autocomplete, Select } from '~/components/form';
import { formats } from '~/helper';
import { FilterContainer } from '~/views/sales-cancellation/styles';

export default function FormFilter({ values, setFieldValue, listCustomers }) {
  return (
    <FilterContainer>
      <Select
        name="balanceType"
        label="Tipo de Saldo"
        options={{
          values: [
            { value: 'all', label: 'Todos' },
            { value: 'ne', label: 'Diferente de Zero' },
            { value: 'gt', label: 'Maior que Zero' },
            { value: 'lt', label: 'Menor que Zero' },
          ],
        }}
        />

      <Autocomplete
        name="customer"
        minLength={0}
        keyField="id"
        label="Cliente"
        value={values.customer}
        valueFormat={row => `${formats.cnpj_cpf(row.vatNumber)} - ${row.name}`}
        loadData={listCustomers}
        emptyText={"Pesquise um cliente"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        />
    </FilterContainer>
  );
};
