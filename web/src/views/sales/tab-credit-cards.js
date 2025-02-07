import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { formats } from '~/helper';
import { TabContainer } from '~/views/sales/styles';
import DataTable from '~/components/datatable';
import { Row } from '~/components/layout';
import { InputLabel } from '~/components/form';

const columns = [
    {
      name: 'Adquirente',
      selector: 'acquirer',
      format: (row) => formats.capitalize(row.acquirer)
    },
    {
      name: 'Bandeira',
      selector: 'cardBrandName',
      format: (row) => formats.capitalize(row.cardBrandName)
    },
    {
      name: 'Data/Hora Captura',
      selector: 'captureDate',
      width: '160px',
      format: (row) => `${formats.dateTimeZone(_.get(row, 'captureDate'), 'dd/MM/yyyy')} ${row.captureTime}`,
    },
    {
      name: 'NSU',
      selector: 'nsu',
      width: '180px'
    },
    {
      name: 'Autorização',
      selector: 'authorization',
      width: '180px'
    },
    {
      name: 'TID',
      selector: 'tid',
      width: '200px'
    },
    {
      name: 'Valor Captura',
      selector: 'grossAmount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.grossAmount)
    },
    {
      name: 'Taxa MDR',
      selector: 'rate',
      right: true,
      width: '90px',
      format: (row) => `${formats.decimal(row.rate)}%`
    },
    {
      name: 'Valor Taxa',
      selector: 'commission',
      right: true,
      width: '100px',
      format: (row) => `${formats.currency(row.commission)}`
    },
    {
      name: 'Valor Líquido',
      selector: 'netAmount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.netAmount)
    },
    {
      name: 'Tipo Captura',
      selector: 'captureType',
      width: '150px'
    },
  ],
  columnsInstallments = [
    {
      name: 'Parcela',
      selector: 'installment',
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
      selector: 'grossAmount',
      right: true,
      format: (row) => formats.currency(row.grossAmount)
    },
    {
      name: 'Taxa MDR',
      selector: 'rate',
      right: true,
      format: (row) => `${formats.decimal(row.rate)}%`
    },
    {
      name: 'Valor Taxa',
      selector: 'commission',
      right: true,
      format: (row) => `${formats.currency(row.commission)}`
    },
    {
      name: 'Valor Líquido',
      selector: 'netAmount',
      right: true,
      format: (row) => formats.currency(row.netAmount)
    }
  ];

const RowExpander = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  padding: 10px;
  min-height: 200px;
  height: 200px;
`;

const Info = ({ label, value }) => {
  return <InputLabel
    label={label}
    value={value}
    inputFontSize="13px"
    inputPadding="15px 10px 3px 8px"
    labelFontSize="11px"
    labelTop="15px" />
};

const OccurenceRow = ({ data }) => {
  return (
    <RowExpander>
      <DataTable
        columns={columnsInstallments}
        data={{ rows: _.get(data, 'installments') || [] }}
        noPagination={true}
        emptyText="Nenhuma parcela encontrada"
        keyField="id"
        onRowClicked={() => {}}
        extraOptions={{
          ignoreRowClicked: false,
          selectableRowsHighlight: false,
          selectableRows: false
        }}
        />

      <div>
        <Row span={3}>
          <Info label="Ponto de Venda" value={data.pointOfSale || ''} />
          <Info label="Tipo Venda" value={data.saleType || ''} />
          <Info label="Terminal" value={data.terminalNo || ''} />
        </Row>
        <Row span={3}>
          <Info label="Nr. Resumo" value={data.batchNo || ''} />
          <Info label="Nr. Referência" value={data.reference || ''} />
          <Info label="Nr. Cartão" value={data.cardNumber || ''} />
        </Row>
        <Row span={2}>
          <Info label="Arquivo" value={data.fileName || ''} />
          <Info label="Nr.Linha" value={data.fileLine || ''} />
        </Row>
      </div>
    </RowExpander>
  );
};

const TabCreditcards = ({ data }) => {
  return (
    <TabContainer>
      <DataTable
        columns={columns}
        data={{ rows: data.creditcards || [] }}
        noPagination={true}
        emptyText="Nenhum cartão de crédito vinculado"
        keyField="id"
        onRowClicked={() => {}}
        extraOptions={{
          ignoreRowClicked: false,
          expandableRows: true,
          highlightOnHover: true,
          expandOnRowClicked: true,
          selectableRows: false,
          selectableRowsHighlight: false,
          expandableRowDisabled: (row) => _.isEmpty(_.get(row, 'installments')),
          expandableRowsComponent: <OccurenceRow />
        }}
        />
    </TabContainer>
  );
};

export default TabCreditcards;
