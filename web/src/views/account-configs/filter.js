import _ from 'lodash';
import React from 'react';
import { Autocomplete } from '~/components/form';
import { FilterContainer } from '~/views/sales-cancellation/styles';

export default function FormFilter({ values, errors, touched, handleListAccountModels, handleListDataSources, handleListSourceItems }) {
  return (
    <FilterContainer>
      <Autocomplete
        name="accountingModel"
        minLength={0}
        keyField="id"
        label="Modelo contábil"
        value={values.accountingModel}
        valueFormat={row => `${row.name}`}
        loadData={handleListAccountModels}
        emptyText={"Pesquise uma conta modelo"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.accountingModel && touched.accountingModel}
      />

      <Autocomplete
        name="dataSource"
        minLength={0}
        keyField="id"
        label="Fonte de dados"
        value={values.dataSource}
        valueFormat={row => `${row.name}`}
        loadData={handleListDataSources}
        emptyText={"Pesquise uma fonte de dados"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.dataSource && touched.dataSource}
      />

      <Autocomplete
        name="sourceItem"
        minLength={0}
        keyField="id"
        label="Item"
        keyApp={`${_.get(values, 'dataSource.id')}-`}
        value={!values.dataSource ? "" : values.sourceItem}
        disabled={!values.dataSource}
        valueFormat={row => `${row.name}`}
        loadData={(term, callback) => handleListSourceItems(term, values.dataSource, callback)}
        emptyText={"Pesquise um item"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.sourceItem && touched.sourceItem}
      />
    </FilterContainer>
  );
};
