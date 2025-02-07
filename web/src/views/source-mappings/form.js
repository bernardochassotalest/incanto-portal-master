import React from "react";
import { FormContainer } from "~/views/acquirers/styles";
import { Autocomplete, InputLabel } from "~/components/form";
import _ from "lodash";

export const SourceMappgingForm = ({ values, errors, touched, previewMode, handleListSourceItem }) => {
  return (
    <FormContainer>
      <InputLabel
        label="Fonte de dados"
        value={_.get(values, "dataSource.name")}
        />
      <InputLabel label="Código" value={values.id} />
      <InputLabel label="Nome" value={values.name} />
      <Autocomplete
        name="sourceItem"
        minLength={0}
        keyField="id"
        keyApp={`${values.id}-${values.source}`}
        label="Mapeamento"
        value={values.sourceItem}
        disabled={previewMode}
        valueFormat={row => `${row.name}`}
        loadData={(term, callback) => handleListSourceItem(term, values.source, callback)}
        emptyText={"Pesquise por um mapeamento"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.sourceItem && touched.sourceItem}
      />
    </FormContainer>
  );
};
