import _ from "lodash";
import React from "react";
import { MdSave, MdCheck, MdClear } from 'react-icons/md';
import Crud from "~/components/crud";
import { SourceMappgingForm } from "~/views/source-mappings/form";
import { Container } from "~/views/source-mappings/styles";
import useSourceMappings from "~/view-data/use-source-mappings";
import useHeader from '~/view-data/use-header';
import { formats } from "~/helper";
import FormFilter from '~/views/source-mappings/filter';

const columns = [
  {
    name: "Origem",
    selector: "dataSource",
    hide: "md",
    format: row => _.get(row, "dataSource.name")
  },
  {
    name: "Código",
    width: "90px",
    selector: "id"
  },
  {
    name: "Nome",
    selector: "name"
  },
  {
    name: "Mapeamento",
    selector: "sourceItem",
    hide: "md",
    format: row => _.get(row, "sourceItem.name")
  },
  {
    name: "Cadastrado em",
    selector: "createdAt",
    hide: "md",
    width: "140px",
    format: row =>
      formats.dateTimeZone(_.get(row, "createdAt"), "dd/MM/yyyy HH:mm")
  }
];

function SourceMappings({ acls }) {
  const canWrite = acls.includes("W");
  const { state, actions } = useSourceMappings();
  const { state: headerState } = useHeader({ useFilter: true });
  const showFilter = _.get(headerState, 'filter.visible');
  const openForm = state.showForm || showFilter;

  let filterActions = [
      { label: 'Limpar Filtro', icon: MdClear, action: () => { actions.changeFilter({}) }},
      { label: 'Aplicar Filtro', icon: MdCheck, action: actions.changeFilter }
    ], formActions = [
      { label: "Salvar", icon: MdSave, isSubmit: true, isDisabled: ({ isValid }) => !isValid || !canWrite, action: actions.update }
    ];

  return (
    <Container>
      <Crud
        openForm={openForm}
        useOpenForm={true}
        onCloseFilter={actions.hideForm}
        columns={columns}
        emptyText="Nenhum mapeamento encontrado"
        data={state.data}
        hideAdd={true}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={data =>
          (showFilter ? 'Filtro' : _.get(data, "id") ? `Mapeamento - ${data.name}` : `Novo mapeamento`)
        }
        formOptions={{
          initialValues: (showFilter ? (_.get(headerState, 'filter.data') || {}) : state.model)
        }}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        renderForm={args => (
          showFilter ?
            <FormFilter {...args}/>
            :
            <SourceMappgingForm
              {...args}
              state={state.model}
              previewMode={!canWrite}
              handleListSourceItem={actions.listSourceItems}
            />
        )}
        actions={showFilter ? filterActions : formActions}
      />
    </Container>
  );
}

export default SourceMappings;
