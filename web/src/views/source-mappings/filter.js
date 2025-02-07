import React from 'react';
import { InputGroup, Select } from '~/components/form';
import { FilterContainer } from '~/views/sales-cancellation/styles';

export default function FormFilter({ values }) {
  return (
    <FilterContainer>
      <Select
        name="mapped"
        label="Itens Mapeados"
        options={{
          values: [
            { value: 'all', label: 'Todos' },
            { value: 'true', label: 'Já mapeados' },
            { value: 'false', label: 'Não mapeados' },
          ],
        }}
        />

      <InputGroup
        type="text"
        name="item"
        label='Descrição do item'
        />
    </FilterContainer>
  );
};
