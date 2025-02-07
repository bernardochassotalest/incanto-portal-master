import React from 'react';
import _ from 'lodash';
import { formats } from '~/helper';
import { TabContainer, RowExpander } from '~/views/sales/styles';
import DataTable from '~/components/datatable';

const columns = [
    {
      name: 'Banco',
      selector: 'bank',
      width: '70px'
    },
    {
      name: 'Agência',
      selector: 'branch',
      width: '90px'
    },
    {
      name: 'Conta',
      selector: 'account',
      width: '110px'
    },
    {
      name: 'Nr. Boleto',
      selector: 'slipNumber',
      width: '150px'
    },
    {
      name: 'Nosso Número',
      selector: 'ourNumber',
      width: '150px',
      format: (row) => `${row.ourNumber}${row.digitOurNumber ? `-${row.digitOurNumber}` : ''}`,
    },
    {
      name: 'Data',
      selector: 'refDate',
      width: '105px',
      format: (row) => formats.dateTimeZone(_.get(row, 'refDate'), 'dd/MM/yyyy'),
    },
    {
      name: 'Vencimento',
      selector: 'dueDate',
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
      name: 'Carteira',
      selector: 'wallet',
      width: '100px'
    },
    {
      name: 'Sacador/Pagador',
      selector: 'holderName'
    }
  ],
  columnsOccurence = [
    {
      name: 'Código',
      selector: 'occurId',
      width: '90px'
    },
    {
      name: 'Ocorrência',
      width: '350px',
      selector: 'occurName'
    },
    {
      name: 'Data',
      selector: 'date',
      width: '105px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy'),
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount)
    },
    {
      name: 'Local de Pagamento',
      wrap: true,
      selector: 'paidPlace'
    },
    {
      name: 'Arquivo',
      width: '350px',
      selector: 'fileName'
    },
    {
      name: 'Linha',
      width: '70px',
      selector: 'fileLine'
    }
  ];

const OccurenceRow = ({ data }) => {
  return (
    <RowExpander>
      <DataTable
        columns={columnsOccurence}
        data={{ rows: _.get(data, 'occurrences') || [] }}
        noPagination={true}
        emptyText="Nenhuma ocorrência encontrada"
        keyField="id"
        onRowClicked={() => {}}
        extraOptions={{
          ignoreRowClicked: false,
          selectableRowsHighlight: false,
          selectableRows: false
        }}
        />
    </RowExpander>
  );
};

const TabSlips = ({ data }) => {
  return (
    <TabContainer>
      <DataTable
        columns={columns}
        data={{ rows: data.slips || [] }}
        noPagination={true}
        emptyText="Nenhum boleto vinculado"
        keyField="id"
        onRowClicked={() => {}}
        extraOptions={{
          ignoreRowClicked: false,
          expandableRows: true,
          highlightOnHover: true,
          expandOnRowClicked: true,
          selectableRows: false,
          selectableRowsHighlight: false,
          expandableRowDisabled: (row) => _.isEmpty(_.get(row, 'occurrences')),
          expandableRowsComponent: <OccurenceRow />
        }}
        />
    </TabContainer>
  );
};

export default TabSlips;
