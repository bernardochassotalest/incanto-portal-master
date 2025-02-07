import React from 'react';
import _ from 'lodash';
import { MdSave } from 'react-icons/md';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { CancellationModelForm, CancellationModelSchema } from '~/views/cancellation-models/form';
import { Container } from '~/views/cancellation-models/styles';
import useCancellationModels from '~/view-data/use-cancellation-models';

const columns = [
  {
    name: 'Nome',
    selector: 'name',
    format: (row) => row.name || '',
  },
  {
    name: 'Tag',
    selector: 'tag',
    width: '160px',
    format: (row) => formats.capitalize(row.tag || ''),
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm'),
  }
];

function CancellationModels({ acls }) {
  const { state, actions } = useCancellationModels();
  const canWrite = acls.includes('W');
  const actionsList = [
      {
        label: 'Salvar',
        icon: MdSave,
        isSubmit: true,
        isDisabled: ({ isValid }) => !isValid || !canWrite,
        action: actions.createOrUpdate,
      }
    ];

  return (
    <Container>
      <Crud
        columns={columns}
        formTitle={(data) => (_.get(data, 'id')) ? `Tipo de cancelamento "${data.name}"` : `Novo tipo de cancelamento`}
        emptyText='Nenhum tipo de cancelamento encontrado'
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        rightWidth="35%"
        formOptions={{
          validationSchema: CancellationModelSchema,
          initialValues: state.model,
        }}
        renderForm={(args) => (
          <CancellationModelForm
            {...args}
            previewMode={!canWrite}
            tags={state.tags}
          />
        )}
        actions={actionsList}
      />
    </Container>
  );
}

export default CancellationModels;
