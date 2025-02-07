import _ from "lodash";
import React from "react";
import Crud from "~/components/crud";
import { AcquirerForm } from "~/views/acquirers/form";
import { Container } from "~/views/acquirers/styles";
import useAcquirers from "~/view-data/use-acquirers";
import { formats } from "~/helper";

const columns = [
  {
    name: "Código",
    width: "140px",
    selector: "id"
  },
  {
    name: "Nome",
    selector: "name"
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

function Acquirers({ acls }) {
  const canWrite = acls.includes("W");
  const { state, actions } = useAcquirers();

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText="Nenhum adquirente encontrado"
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={data =>
          _.get(data, "id") ? `Adquirente - ${data.id}` : `Novo Adquirente`
        }
        formOptions={{
          initialValues: state.model,
        }}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        renderForm={args => <AcquirerForm {...args} previewMode={!canWrite} />}
      />
    </Container>
  );
}

export default Acquirers;
