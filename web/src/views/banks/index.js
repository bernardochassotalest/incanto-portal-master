import _ from "lodash";
import React from "react";
import Crud from "~/components/crud";
import { BanksForm } from "~/views/banks/form";
import { Container } from "~/views/banks/styles";
import useBanks from "~/view-data/use-banks";
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
    name: "Apelido",
    selector: "nick"
  },
  {
    name: "ISPB",
    selector: "ispb"
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

function Banks({ acls }) {
  const canWrite = acls.includes("W");
  const { state, actions } = useBanks();

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText="Nenhum banco encontrado"
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={data =>
          _.get(data, "id") ? `Banco - ${data.id}` : `Novo Banco`
        }
        formOptions={{
          initialValues: state.model,
        }}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        renderForm={args => <BanksForm {...args} previewMode={!canWrite} />}
      />
    </Container>
  );
}

export default Banks;
