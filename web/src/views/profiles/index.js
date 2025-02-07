import _ from 'lodash';
import React from 'react';
import { MdSave } from 'react-icons/md';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import useProfiles from '~/view-data/use-profiles';
import { ProfileForm, ProfileSchema } from '~/views/profiles/form';
import { Container } from '~/views/profiles/styles';
import CellStatus from '~/components/datatable/cell-status';
import { red, green } from '~/components/mixins/color';

const columns = [
  {
    name: '# Nome',
    selector: 'name',
    cell: (row) => {
      return (
        <CellStatus title={row.name} color={row.active ? green.hex() : red.hex()}>
          <strong>{row.name}</strong>
        </CellStatus>
      );
    },
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm')
  }
];

function Profile({ acls }) {
  const { state, actions } = useProfiles(),
    canWrite = acls.includes('W') && _.get(state, 'model.id') !== 1;

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText='Nenhum perfil encontrado'
        formTitle={(data) => (_.get(data, 'id')) ? `Perfil #${data.id}` : `Novo perfil`}
        data={state.data || {}}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        rightWidth="50%"
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        formOptions={{
          validationSchema: ProfileSchema,
          initialValues: state.model,
          initialTouched: { permissions: true },
        }}
        renderForm={(args) => (
          <ProfileForm
            {...args}
            permissions={state.permissions}
            tags={state.tags}
            previewMode={!canWrite}
          />
        )}
        actions={[
          {
            label: 'Salvar',
            icon: MdSave,
            isSubmit: true,
            isDisabled: ({ isValid }) => !isValid || !canWrite,
            action: actions.createOrUpdate,
          },
        ]}
      />
    </Container>
  );
}

export default Profile;
