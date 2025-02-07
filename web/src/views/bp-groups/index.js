import _ from "lodash";
import React from "react";
import Crud from "~/components/crud";
import { BPGroupsForm } from "~/views/bp-groups/form";
import { Container } from "~/views/bp-groups/styles";
import useBPGroups from "~/view-data/use-bp-groups";
import { formats } from "~/helper";

const columns = [
  {
    name: "Código",
    width: "140px",
    selector: "grpCode"
  },
  {
    name: "Nome",
    selector: "grpName"
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

function BPGroups({ acls }) {
  const canWrite = acls.includes("W");
  const { state, actions } = useBPGroups();

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText="Nenhum grupo encontrado"
        data={state.data}
        keyField="grpCode"
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={data =>
          _.get(data, "id") ? `Grupo - ${data.id}` : `Novo Grupo`
        }
        formOptions={{
          initialValues: state.model,
        }}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        renderForm={args => <BPGroupsForm {...args} previewMode={!canWrite} />}
        actions={[]}
      />
    </Container>
  );
}

export default BPGroups;
