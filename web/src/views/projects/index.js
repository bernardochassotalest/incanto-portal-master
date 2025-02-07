import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { ProjectForm } from '~/views/projects/form';
import { Container } from '~/views/projects/styles';
import useProjects from '~/view-data/use-projects';

const columns = [
  {
    name: 'Código',
    selector: 'prjCode',
    width: '140px',
  },
  {
    name: 'Nome',
    selector: 'prjName',
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
  const { state, actions } = useProjects();

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText='Nenhum projeto encontrado'
        data={state.data}
        hideAdd={!canWrite}
        keyField="prjCode"
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={(data) => (_.get(data, 'prjCode')) ? `Projeto - ${data.prjCode}` : `Novo projeto`}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        formOptions={{
          initialValues: state.model,
          initialTouched: { identify: true },
        }}
        renderForm={(args) => <ProjectForm {...args} previewMode={!canWrite} />}
        actions={[]}
      />
    </Container>
  );
}

export default Projects;
