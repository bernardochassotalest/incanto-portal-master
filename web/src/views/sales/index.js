import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { SalesStatusMapping } from '~/constants';
import { MdCheck, MdClear } from 'react-icons/md';
import { Container } from '~/views/sales/styles';
import useSales from '~/view-data/use-sales';
import useHeader from '~/view-data/use-header';
import FormFilter from '~/views/sales/filter';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IconButton } from '~/components/crud/styles';
import DetailModal from '~/views/sales/detail-modal';

const columns = [
    {
      name: 'Origem',
      selector: 'source',
      width: '120px'
    },
    {
      name: 'Tag',
      selector: 'tag',
      width: '120px'
    },
    {
      name: 'Status',
      selector: 'status',
      width: '120px',
      format: (row) => SalesStatusMapping[row.status] || ''
    },
    {
      name: 'Data',
      selector: 'taxDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'taxDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Cancelada em',
      selector: 'cancelDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'cancelDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId',
      width: '160px',
    },
    {
      name: 'Cliente',
      selector: 'vatNumber',
      format: (row) => `${formats.cnpj_cpf(row.vatNumber)} - ${row.name}`
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Ações',
      width: '60px',
      right: true,
      cell: (row) => <>
        {row.url &&
          <IconButton size={28} title="Ver detalhes" onClick={() => window.open(row.url, '_blank')}>
            <HiOutlineExternalLink />
          </IconButton>
        }
      </>
    }
  ];

function Sales({ acls, history }) {
  const { state, actions } = useSales();
  const { state: headerState } = useHeader({ useFilter: true });
  const showFilter = _.get(headerState, 'filter.visible');
  const openForm = state.showForm || showFilter;

  let filterActions = [
      { label: 'Limpar Filtro', icon: MdClear, action: () => { actions.changeFilter({ active: true }) }},
      { label: 'Aplicar Filtro', icon: MdCheck, action: actions.changeFilter }
    ];

  const handleLoad = (data) => {
    // history.push(`/sales/${data.id}`);
    actions.openModalDetail(data);
  };

  return (
    <Container>
      <Crud
        openForm={openForm}
        useOpenForm={true}
        onCloseFilter={actions.hideForm}
        columns={columns}
        emptyText='Nenhuma venda encontrada'
        data={state.data}
        hideAdd={true}
        keyField="id"
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={(data) => `Venda`}
        onChangePage={actions.pageChange}
        onRowClicked={handleLoad}
        formOptions={{
          initialTouched: {},
          initialValues: _.get(headerState, 'filter.data') || {},
        }}
        renderForm={(args) => (
          <FormFilter
            listCustomers={actions.listCustomers}
            listProducts={actions.listProducts}
            {...args}
            />
        )}
        actions={filterActions}
      />

      <DetailModal
        title={<span>Detalhes da Venda - Cliente {formats.cnpj_cpf(_.get(state, 'model.header.customer.vatNumber'))}</span>}
        isOpen={state.isDetailModalOpen}
        loading={state.modalLoading}
        data={state.model}
        tab={state.detailTab}
        changeTab={actions.changeDetailTab}
        closeModal={() => { actions.closeModalDetail() }}
        />
    </Container>
  );
}

export default Sales;
