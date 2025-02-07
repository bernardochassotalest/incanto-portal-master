import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { CostingCenterForm } from '~/views/costing-centers/form';
import { Container } from '~/views/costing-centers/styles';
import useCostingCenters from '~/view-data/use-costing-centers';

const columns = [
  {
    name: 'Código',
    selector: 'ocrCode',
    width: '140px',
  },
  {
    name: 'Nome',
    selector: 'ocrName',
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm')
  },
];

function Projects({ acls }) {
  const canWrite = acls.includes('W');
  const { state, actions } = useCostingCenters();

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText='Nenhum centro de custo encontrado'
        data={state.data}
        hideAdd={!canWrite}
        keyField="ocrCode"
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={(data) => (_.get(data, 'ocrCode')) ? `Centro de custo - ${data.ocrCode}` : `Novo centro de custo`}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        formOptions={{
          initialValues: state.model,
          initialTouched: { identify: true },
        }}
        renderForm={(args) => <CostingCenterForm {...args} previewMode={!canWrite} />}
        actions={[]}
      />
    </Container>
  );
}

export default Projects;
