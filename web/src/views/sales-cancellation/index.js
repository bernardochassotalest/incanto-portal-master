import React from 'react';
import _ from 'lodash';
import { MdSave, MdClear, MdCheck } from 'react-icons/md';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { SaleCancellationForm, SaleCancellationSchema } from '~/views/sales-cancellation/form';
import { Container } from '~/views/sales-cancellation/styles';
import useHeader from '~/view-data/use-header';
import useSalesCancellation from '~/view-data/use-sales-cancellation';
import FormFilter from '~/views/sales-cancellation/filter';

const columns = [
  {
    name: 'Nr.Venda',
    selector: 'sourceId',
    hide: 'md',
    width: '150px',
    format: (row) => _.get(row, 'sourceId'),
  },
  {
    name: 'Cliente',
    selector: 'customer',
    format: (row) => `${formats.cnpj_cpf(_.get(row, 'customer.vatNumber'))} - ${_.get(row, 'customer.name') || ''}`,
  },
  {
    name: 'Valor',
    selector: 'amount',
    right: true,
    width: '150px',
    format: (row) => formats.currency(_.get(row, 'amount')),
  },
  {
    name: 'Data de vencimento',
    selector: 'dueDate',
    width: '140px',
    center: true,
    format: (row) => formats.dateTimeZone(_.get(row, 'dueDate'), 'dd/MM/yyyy'),
  },
  {
    name: 'Data de referẽncia',
    selector: 'refDate',
    width: '140px',
    center: true,
    format: (row) => formats.dateTimeZone(_.get(row, 'refDate'), 'dd/MM/yyyy'),
  },
  {
    name: 'Com Justificativa?',
    selector: 'cancellation',
    hide: 'md',
    width: '140px',
    center: true,
    format: (row) => !!_.get(row, 'cancellation.user.name') ? 'Sim' : 'Não'
  },
  {
    name: 'Autor Justificativa',
    selector: 'cancellation',
    hide: 'md',
    width: '180px',
    format: (row) => _.get(row, 'cancellation.user.name'),
  },
  {
    name: 'Tag',
    selector: 'tag',
    hide: 'md',
    width: '150px',
    format: (row) => formats.capitalize(_.get(row, 'tag')),
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    left: true,
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm'),
  }
];

function SaleCancellation({ acls }) {
  const { state, actions } = useSalesCancellation();
  const { state: headerState } = useHeader({ useFilter: false });
  const canWrite = acls.includes('W');
  const showFilter = _.get(headerState, 'filter.visible');
  const openForm = state.showForm || showFilter;

  let formActions = [
      {
        label: 'Salvar',
        icon: MdSave,
        isSubmit: true,
        isDisabled: ({ isValid }) => !isValid || !canWrite,
        action: actions.createOrUpdate,
      },
    ],
    filterActions = [
      { label: 'Limpar Filtro', icon: MdClear, action: () => { actions.changeFilter({ active: true }) }},
      { label: 'Aplicar Filtro', icon: MdCheck, action: actions.changeFilter }
    ];

  return (
    <Container>
      <Crud
        openForm={openForm}
        useOpenForm={true}
        columns={columns}
        formTitle={(data) => {
          if (showFilter) {
            return 'Filtro';
          }
          return (_.get(data, 'id')) ? `Cancelamento de venda #${formats.date(data.dueDate)} ${formats.currency(data.amount)}` : `Novo cancelamento de venda`;
        }}
        emptyText='Nenhuma venda cancelada encontrada'
        data={state.data}
        hideAdd={true}
        onCloseFilter={actions.hideForm}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        rightWidth="35%"
        formOptions={{
          validationSchema: showFilter ? undefined : SaleCancellationSchema,
          initialTouched: showFilter ? {} : { notes: true },
          initialValues: (showFilter ? _.get(headerState, 'filter.data') : state.model) || {},
        }}
        renderForm={(args) => (
          showFilter ?
          <FormFilter
            listUsers={actions.listUsers}
            {...args}
            />
          :
          <SaleCancellationForm
            previewMode={!canWrite}
            listCancellationTypes={actions.listCancellationTypes}
            {...args}
            />
        )}
        actions={!showFilter ? (!canWrite ? [] : formActions) : filterActions}
      />
    </Container>
  );
}

export default SaleCancellation;
