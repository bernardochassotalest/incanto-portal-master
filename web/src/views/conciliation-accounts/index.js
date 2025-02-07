import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { MdSave, MdDelete } from 'react-icons/md';
import { ConciliationAccountsForm, ConciliationAccountsSchema } from '~/views/conciliation-accounts/form';
import { Container } from '~/views/conciliation-accounts/styles';
import confirm from '~/components/confirm';
import useConciliationAccounts from '~/view-data/use-conciliation-accounts';

const typeMapping = {
    account: 'Contábil',
    finance: 'Financeira',
  }, columns = [{
    name: 'Tipo',
    selector: 'type',
    width: '150px',
    format: (row) => typeMapping[row.type || ''],
  },
  {
    name: 'Conta contábil',
    selector: 'chartOfAccount',
    format: row => `${_.get(row, 'chartOfAccount.acctCode')} - ${_.get(row, 'chartOfAccount.acctName')}`
  },
  {
    name: 'Parceiro de Negócio',
    selector: 'businessPartner',
    format: row => _.get(row, 'businessPartner.cardCode') && `${_.get(row, 'businessPartner.cardCode')} - ${_.get(row, 'businessPartner.cardName')}`
  }
];

function ConciliationAccounts({ acls }) {
  const { state, actions } = useConciliationAccounts();
  const canWrite = acls.includes("W");
  const handleRemove = async (values, action) => {
     const result = await confirm.show({
       title: 'Atenção',
       text: `Deseja remover a configuração?`,
     });

     if (result) {
       actions.remove(values, action);
     }
   };
  return (
    <Container>
      <Crud
        columns={columns}
        emptyText="Nenhum configuração encontrada"
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={data =>
          _.get(data, "id")
            ? `Configuração de Contas Conciliadas`
            : `Nova configuração`
        }
        formOptions={{
          initialValues: state.model,
          validationSchema: ConciliationAccountsSchema,
          initialTouched: { chartOfAccount: true }
        }}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        renderForm={args => (
          <ConciliationAccountsForm
            {...args}
            previewMode={!canWrite}
            handleListChartOfAccounts={actions.listChartOfAccounts}
            handleListBusinessPartners={actions.listBusinessPartners}
          />
        )}
        actions={[
          {
            label: "Remover",
            icon: MdDelete,
            isDisabled: ({ values }) => !canWrite || !_.get(values, 'id'),
            action: handleRemove
          },
          {
            label: "Salvar",
            icon: MdSave,
            isSubmit: true,
            isDisabled: ({ isValid }) => !isValid || !canWrite,
            action: actions.createOrUpdate
          },
        ]}
      />
    </Container>
  );
}

export default ConciliationAccounts;
