import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { ChartOfAccountTypesMapping } from '~/constants';
import { ChartOfAccountForm } from '~/views/chart-of-accounts/form';
import { Container } from '~/views/chart-of-accounts/styles';
import useChartOfAccounts from '~/view-data/use-chart-of-accounts';

const columns = [
  {
    name: 'Código',
    selector: 'acctCode',
    width: '170px',
  },
  {
    name: 'Nome',
    selector: 'acctName',
  },
  {
    name: 'Tipo',
    selector: 'accountType',
    width: '130px',
    format: (row) => ChartOfAccountTypesMapping[row.accountType] || row.accountType || ''
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm')
  },
];

const conditionalRowStyles = [
  {
    when: (row) => !row.titleAccount,
    style: { '&:hover': { fontWeight: 'bold !important' }, '&>div': { fontWeight: 'bold !important' }}
  }
];

function ChartOfAccounts({ acls }) {
  const canWrite = acls.includes('W');
  const { state, actions } = useChartOfAccounts();

  return (
    <Container>
      <Crud
        columns={columns}
        emptyText='Nenhum plano de conta encontrado'
        data={state.data}
        hideAdd={!canWrite}
        keyField="acctCode"
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={(data) => (_.get(data, 'acctCode')) ? `Plano de conta - ${data.acctCode}` : `Novo plano de conta`}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        dataTableOptions={{
          conditionalRowStyles: conditionalRowStyles
        }}
        formOptions={{
          initialValues: state.model,
          initialTouched: { identify: true },
        }}
        renderForm={(args) => <ChartOfAccountForm {...args} previewMode={!canWrite} />}
        actions={[]}
      />
    </Container>
  );
}

export default ChartOfAccounts;
