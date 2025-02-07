import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { formats } from '~/helper';
import { Row } from '~/components/layout';
import { InputLabel } from '~/components/form';
import { TabContainer } from '~/views/sales/styles';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IconButton } from '~/components/crud/styles';
import DataTable from '~/components/datatable';

const columns = [
  {
    name: 'Código',
    selector: 'itemCode',
    width: '110px'
  },
  {
    name: 'Descrição',
    selector: 'itemName',
  },
  {
    name: 'Quantidade',
    selector: 'totalAmount',
    right: true,
    width: '100px',
    format: (row) => formats.decimal(row.quantity)
  },
  {
    name: 'Vl. Unitário',
    selector: 'totalAmount',
    right: true,
    width: '120px',
    format: (row) => formats.currency(row.unitPrice)
  },
  {
    name: 'Vl. Desconto',
    selector: 'discAmount',
    right: true,
    width: '120px',
    format: (row) => formats.currency(row.discAmount)
  },
  {
    name: 'Vl. Total',
    selector: 'totalAmount',
    right: true,
    width: '120px',
    format: (row) => formats.currency(row.totalAmount)
  },
  {
    name: 'Atribuído a',
    selector: 'totalAmount',
    format: (row) => `${formats.cnpj_cpf(row.ownerVatNo)} - ${row.ownerName}`
  },
  {
    name: 'Ações',
    width: '50px',
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

const RowExpander = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  min-height: 60px;
  height: 60px;
`;

const Info = ({ label, value }) => {
  return <InputLabel
    label={label}
    value={value || '  '}
    inputFontSize="13px"
    inputPadding="15px 10px 3px 8px"
    labelFontSize="11px"
    labelTop="15px" />
};

const TicketsRow = ({ data }) => {
  return (
    <RowExpander>
      <Row span={5}>
        <Info label="Setor" value={`${data.tickets.area}`} />
        <Info label="Subsetor" value={`${data.tickets.sector}`} />
        <Info label="Fileira" value={`${data.tickets.row}`} />
        <Info label="Assento" value={`${data.tickets.seat}`} />
        <Info label="Área de Preços" value={`${data.tickets.priceAreaName}`} />
      </Row>
    </RowExpander>
  );
};

const TabItems = ({ data }) => {
  return (
    <TabContainer>
      <DataTable
        columns={columns}
        data={{ rows: data.items || [] }}
        noPagination={true}
        emptyText="Nenhum item vinculado"
        keyField="id"
        onRowClicked={() => {}}
        extraOptions={{
          ignoreRowClicked: false,
          expandableRows: true,
          highlightOnHover: true,
          expandOnRowClicked: true,
          selectableRowsHighlight: false,
          selectableRows: false,
          expandableRowDisabled: (row) => _.isEmpty(_.get(row, 'tickets')),
          expandableRowsComponent: <TicketsRow />
        }}
        />
    </TabContainer>
  );
};

export default TabItems;
