import React from 'react';
import { isBefore } from 'date-fns';
import { Row } from '~/components/layout';
import { Autocomplete, Select, InputDate, InputGroup } from '~/components/form';
import { FilterContainer } from '~/views/sales-cancellation/styles';

const labelByType = {
  'sourceId': 'Número da Fatura',
  'transId': 'Lançamento Contábil',
  'ourNumber': 'Boleto: Nosso Número',
  'authorization': 'Cartão: Autorização',
  'nsu': 'Cartão: NSU',
  'tid': 'Cartão: TID',
};

export default function FormFilter({ values, setFieldValue, listCustomers, listProducts }) {
  return (
    <FilterContainer>
      <Select
        name="type"
        label="Tipo"
        options={{
          values: [
            { value: 'period', label: 'Período' },
            { value: 'customerId', label: 'Cliente' },
            { value: 'itemCode', label: 'Produto' },
            { value: 'sourceId', label: 'Número da Fatura' },
            { value: 'transId', label: 'Lançamento Contábil' },
            { value: 'ourNumber', label: 'Boleto: Nosso Número' },
            { value: 'authorization', label: 'Cartão: Autorização' },
            { value: 'nsu', label: 'Cartão: NSU' },
            { value: 'tid', label: 'Cartão: TID' },
          ],
        }}
        />

      { values.type === 'period' &&
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
      }

      { values.type === 'customerId' &&
        <Autocomplete
          name="customer"
          minLength={0}
          keyField="id"
          label="Cliente"
          value={values.customer}
          valueFormat={row => `${row.name}`}
          loadData={listCustomers}
          emptyText={"Pesquise um cliente"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
          />
      }

      { values.type === 'itemCode' &&
        <Autocomplete
          name="product"
          minLength={0}
          keyField="id"
          label="Produto"
          value={values.product}
          valueFormat={row => `${row.name}`}
          loadData={listProducts}
          emptyText={"Pesquise um produto"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
          />
      }

      { !/^(customerId|itemCode|period)$/.test(values.type) &&
        <InputGroup
          type="text"
          name="term"
          label={labelByType[values.type] || 'Valor'}
          />
      }

    </FilterContainer>
  );
};
