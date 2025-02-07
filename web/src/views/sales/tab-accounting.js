import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { formats } from '~/helper';
import { Row } from '~/components/layout';
import { InputLabel } from '~/components/form';
import { TabContainer } from '~/views/sales/styles';
import DataTable from '~/components/datatable';

const columns = [
  {
    name: 'Modelo',
    selector: 'model',
    width: '300px',
    wrap: true
  },
  {
    name: 'Nr.Lançamento',
    selector: 'transId',
    width: '140px',
  },
  {
    name: 'Dt.Lançamento',
    selector: 'refDate',
    center: true,
    width: '105px',
    format: (row) => formats.dateTimeZone(_.get(row, 'refDate'), 'dd/MM/yyyy'),
  },
  {
    name: 'Dt.Documento',
    selector: 'taxDate',
    center: true,
    width: '105px',
    format: (row) => formats.dateTimeZone(_.get(row, 'taxDate'), 'dd/MM/yyyy'),
  },
  {
    name: 'Dt.Vencimento',
    selector: 'dueDate',
    center: true,
    width: '105px',
    format: (row) => formats.dateTimeZone(_.get(row, 'dueDate'), 'dd/MM/yyyy'),
  },
  {
    name: 'Valor',
    selector: 'amount',
    right: true,
    width: '120px',
    format: (row) => formats.currency(row.amount)
  },
  {
    name: 'Observações',
    selector: 'memo',
    wrap: true,
    cell: (row) => <Line text={row.memo || ''} />
  },
];

const Line = ({ text }) => {
  return (<div title={text}>{text}</div>);
};

const RowExpander = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  min-height: 110px;
  height: 110px;
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

const DetailsRow = ({ data }) => {
  return (
    <RowExpander>
      <Row span={2}>
        <Info label="Conta de Débito" value={`${data.debAcctCode} - ${data.debAcctName}`} />
        <Info label="PN de Débito" value={(data.debCardCode && data.debCardName) ? `${data.debCardCode} - ${data.debCardName}` : ''} />
      </Row>
      <Row span={2}>
        <Info label="Conta de Crédito" value={`${data.crdAcctCode} - ${data.crdAcctName}`} />
        <Info label="PN de Crédito" value={(data.crdCardCode && data.crdCardName) ? `${data.crdCardCode} - ${data.crdCardName}` : ''} />
      </Row>
    </RowExpander>
  );
};

const TabAccounting = ({ data }) => {
  return (
    <TabContainer>
      <DataTable
        columns={columns}
        data={{ rows: data.accounting || [] }}
        noPagination={true}
        emptyText="Sem dados de vinculado"
        keyField="id"
        onRowClicked={() => {}}
        extraOptions={{
          ignoreRowClicked: false,
          expandableRows: true,
          highlightOnHover: true,
          expandOnRowClicked: true,
          selectableRows: false,
          selectableRowsHighlight: false,
          expandableRowDisabled: () => false,
          expandableRowsComponent: <DetailsRow />
        }}
        />
    </TabContainer>
  );
};

export default TabAccounting;
