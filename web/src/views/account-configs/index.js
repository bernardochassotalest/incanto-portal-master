import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { MdSave, MdDelete, MdCheck, MdClear } from 'react-icons/md';
import { formats } from '~/helper';
import { AccountConfigForm, AccountConfigSchema } from '~/views/account-configs/form';
import { Container } from '~/views/account-configs/styles';
import confirm from '~/components/confirm';
import useAccountConfig from '~/view-data/use-account-configs';
import useHeader from '~/view-data/use-header';
import CellStatus from '~/components/datatable/cell-status';
import FormFilter from '~/views/account-configs/filter';
import { red, green } from '~/components/mixins/color';

const columns = [
  {
    name: '# Modelo contábil',
    selector: 'accountingModel',
    cell: (row) => {
      let text = _.get(row, 'accountingModel.name');
      return (
        <CellStatus title={text} color={row.isActive ? green.hex() : red.hex()}>
          <span>{text}</span>
        </CellStatus>
      );
    },
  },
  {
    name: 'Origem',
    selector: 'dataSource',
    width: '120px',
    format: row => _.get(row, 'dataSource.name')
  },
  {
    name: 'Item',
    selector: 'item',
    width: '150px',
    format: row => formats.capitalize(_.get(row, 'item'))
  },
  {
    name: 'Válido a partir de',
    selector: 'validFrom',
    hide: 'md',
    center: true,
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'validFrom'), 'dd/MM/yyyy')
  },
  {
    name: 'Conta contábil (débito)',
    selector: 'debChartOfAccount',
    format: row => `${_.get(row, 'debChartOfAccount.acctCode')} - ${_.get(row, 'debChartOfAccount.acctName')}`
  },
  {
    name: 'Conta contábil (crédito)',
    selector: 'credChartOfAccount',
    format: row => `${_.get(row, 'credChartOfAccount.acctCode')} - ${_.get(row, 'credChartOfAccount.acctName')}`
  }
];

function AccountConfig({ acls }) {
  const { state, actions } = useAccountConfig();
  const canWrite = acls.includes("W") && !_.get(state, 'model.editLocked', false);
  const { state: headerState } = useHeader({ useFilter: true });
  const showFilter = _.get(headerState, 'filter.visible');
  const openForm = state.showForm || showFilter;

  const handleRemove = async (values, action) => {
     const result = await confirm.show({
       title: 'Atenção',
       text: `Deseja remover a configuração contábil?`,
     });

     if (result) {
       actions.remove(values, action);
     }
   };

  const filterActions = [
      { label: 'Limpar Filtro', icon: MdClear, action: () => { actions.changeFilter({}) }},
      { label: 'Aplicar Filtro', icon: MdCheck, action: actions.changeFilter }
    ], formActions = [
      { label: "Remover", icon: MdDelete, isDisabled: ({ values }) => !canWrite || !_.get(values, 'id'), action: handleRemove },
      { label: "Salvar", icon: MdSave, isSubmit: true, isDisabled: ({ isValid }) => !isValid || !canWrite, action: actions.createOrUpdate },
    ];

  return (
    <Container>
      <Crud
        openForm={openForm}
        useOpenForm={true}
        onCloseFilter={actions.hideForm}
        columns={columns}
        emptyText="Nenhum configuração contábil encontrada"
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={data =>
          (showFilter ? 'Filtro' : _.get(data, "id") ? `Configuração Contábi` : `Nova configuração contábil`)
        }
        formOptions={{
          initialValues: (showFilter ? (_.get(headerState, 'filter.data') || {}) : state.model),
          validationSchema: AccountConfigSchema,
          initialTouched: { validFrom: true }
        }}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        renderForm={args => (
          showFilter ?
            <FormFilter
              {...args}
              handleListAccountModels={actions.listAccountModels}
              handleListDataSources={actions.listDataSources}
              handleListSourceItems={actions.listSourceItems}
            />
            :
            <AccountConfigForm
              {...args}
              previewMode={!canWrite}
              handleListAccountModels={actions.listAccountModels}
              handleListDataSources={actions.listDataSources}
              handleListSourceItems={actions.listSourceItems}
              handleListChartOfAccounts={actions.listChartOfAccounts}
              handleListBusinessPartners={actions.listBusinessPartners}
              handleListCostingCenters={actions.listCostingCenters}
              handleListProjects={actions.listProjects}
            />
        )}
        actions={showFilter ? filterActions : formActions}
      />
    </Container>
  );
}

export default AccountConfig;
