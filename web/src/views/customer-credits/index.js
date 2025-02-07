import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { MdCheck, MdClear } from 'react-icons/md';
import { Container } from '~/views/customer-credits/styles';
import useCustomerCredits from '~/view-data/use-customer-credits';
import useHeader from '~/view-data/use-header';
import FormFilter from '~/views/customer-credits/filter';
import DetailModal from '~/views/customer-credits/detail-modal';

const columns = [
  {
    name: 'CPF',
    selector: 'vatNumber',
    width: '160px',
    format: (row) => formats.cnpj_cpf(row.vatNumber)
  },
  {
    name: 'Nome',
    selector: 'name',
  },
  {
    name: 'E-mail',
    selector: 'email',
    width: '280px',
  },
  {
    name: 'Saldo',
    selector: 'balance',
    width: '180px',
    right: true,
    format: (row) => formats.currency(row.balance),
  }
];

function CustomerCredits({ acls }) {
  const { state, actions } = useCustomerCredits();
  const { state: headerState } = useHeader({ useFilter: true });
  const showFilter = _.get(headerState, 'filter.visible');
  const openForm = state.showForm || showFilter;

  let filterActions = [
      { label: 'Limpar Filtro', icon: MdClear, action: () => { actions.changeFilter({ active: true }) }},
      { label: 'Aplicar Filtro', icon: MdCheck, action: actions.changeFilter }
    ];

  return (
    <Container>
      <Crud
        openForm={openForm}
        useOpenForm={true}
        onCloseFilter={actions.hideForm}
        columns={columns}
        emptyText='Nenhum crédito de cliente encontrado'
        data={state.data}
        hideAdd={true}
        keyField="id"
        rightWidth="35%"
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={(data) => 'Filtro'}
        onChangePage={actions.pageChange}
        onRowClicked={actions.openModalDetail}
        formOptions={{
          initialTouched: {},
          initialValues: (_.get(headerState, 'filter.data') || {}),
        }}
        renderForm={(args) => (
          <FormFilter
            listCustomers={actions.listCustomers}
            {...args}
            />
          )}
        actions={filterActions}
      />
      <DetailModal
        title={<span>Créditos do Cliente: {formats.cnpj_cpf(_.get(state, 'selected.vatNumber'))} - {_.get(state, 'selected.name')}</span>}
        isOpen={state.isDetailModalOpen}
        loading={state.modalLoading}
        data={state.model}
        closeModal={() => { actions.closeModalDetail() }}
        isOpenBillDetailModal={state.isOpenBillDetailModal}
        billDetailModalLoading={state.billDetailModalLoading}
        billsDetail={state.billsDetail}
        billsDetailTab={state.billsDetailTab}
        openBillDetailModal={actions.openBillDetailModal}
        changeBillsDetailTab={actions.changeBillsDetailTab}
        closeBillDetailModal={actions.closeBillDetailModal}
        />
    </Container>
  );
}

export default CustomerCredits;
