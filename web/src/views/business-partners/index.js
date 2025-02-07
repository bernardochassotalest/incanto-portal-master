import _ from 'lodash';
import React from 'react';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { MdCheck, MdClear } from 'react-icons/md';
import { BusinessPartnerTypesMapping } from '~/constants';
import { BusinessPartnerForm } from '~/views/business-partners/form';
import { Container } from '~/views/business-partners/styles';
import useBusinessPartners from '~/view-data/use-business-partners';
import useHeader from '~/view-data/use-header';
import FormFilter from '~/views/business-partners/filter';

const columns = [
  {
    name: 'Código',
    selector: 'cardCode',
    width: '170px',
  },
  {
    name: 'Nome',
    selector: 'cardName',
  },
  {
    name: 'Tipo',
    selector: 'type',
    width: '130px',
    format: (row) => BusinessPartnerTypesMapping[row.type] || row.type || ''
  },
  {
    name: 'CNPJ/CPF',
    selector: 'vatNumber',
    width: '170px',
    format: (row) => formats.cnpj_cpf(row.vatNumber)
  },
  {
    name: 'Grupo',
    selector: 'bpGroup',
    format: (row) => _.get(row, 'bpGroup.grpName'),
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm')
  },
];

function BusinessPartners({ acls }) {
  const { state, actions } = useBusinessPartners();
  const { state: headerState } = useHeader({ useFilter: true });
  const canWrite = acls.includes('W');
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
        emptyText='Nenhum parceiro de negócio encontrado'
        data={state.data}
        hideAdd={!canWrite}
        keyField="cardCode"
        tableLoading={state.loading}
        formLoading={state.formLoading}
        formTitle={(data) => (_.get(data, 'cardCode')) ? `Parceiro de negócio - ${data.cardCode}` : `Novo parceiro de negócio`}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        formOptions={{
          initialTouched: {},
          initialValues: (showFilter ? _.get(headerState, 'filter.data') : state.model) || {},
        }}
        renderForm={(args) => (
          showFilter ?
          <FormFilter
            listGroups={actions.listGroups}
            {...args}
            />
          : 
          <BusinessPartnerForm
            previewMode={!canWrite}
            {...args}
            />
        )}
        actions={!showFilter ? [] : filterActions}
      />
    </Container>
  );
}

export default BusinessPartners;
