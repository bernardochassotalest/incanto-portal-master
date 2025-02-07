import _ from 'lodash';
import React from 'react';
import { MdSave, MdVpnKey } from 'react-icons/md';
import confirm from '~/components/confirm';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import useUsers from '~/view-data/use-users';
import { UserForm, UserSchema } from '~/views/users/form';
import { Container } from '~/views/users/styles';
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
    name: 'Perfil',
    selector: 'profile',
    hide: 'md',
    width: '280px',
    format: (row) => _.get(row, 'profile.name')
  },
  {
    name: 'Último Acesso',
    selector: 'lastAccess',
    center: true,
    hide: 'md',
    width: '160px',
    format: (row) => formats.dateTimeZone(_.get(row, 'lastAccess.lastAccess.date'), 'dd/MM/yyyy HH:mm')
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    center: true,
    hide: 'md',
    width: '160px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm')
  }
];

function User({ acls }) {
  const { actions, state } = useUsers();
  const canWrite = acls.includes('W') && _.get(state, 'model.id') !== 1;

  async function handlePasswordReset(data, options) {
    const result = await confirm.show({
      title: 'Atenção',
      text: `Deseja realmente redefinir a senha do usuário "${data.name}"?`,
    });

    if (result) {
      actions.resetPassword(data, options);
    }
  };

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText='Nenhum usuário encontrado'
        formTitle={(data) => (_.get(data, 'id')) ? `Usuário #${data.id}` : `Novo usuário`}
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        formOptions={{
          validationSchema: UserSchema,
          initialValues: state.model,
          initialTouched: { name: true },
        }}
        renderForm={(args) => (
          <UserForm
            previewMode={!canWrite}
            handleListProfiles={actions.listProfiles}
            {...args}
          />
        )}
        actions={[
          {
            label: 'Redefinir Senha',
            icon: MdVpnKey,
            isDisabled: ({ isValid }) => !_.get(state, 'model.id') || !canWrite,
            action: handlePasswordReset,
          },
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

export default User;
