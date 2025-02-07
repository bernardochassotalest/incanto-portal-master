import React from 'react';
import _ from 'lodash';
import { formats } from '~/helper';
import { TabContainer, RowExpander } from '~/views/sales/styles';
import DataTable from '~/components/datatable';

const columns = [
    {
      name: 'Banco',
      selector: 'debBank',
      width: '70px'
    },
    {
      name: 'Agência',
      selector: 'debBranch',
      width: '90px'
    },
    {
      name: 'Conta',
      selector: 'debAccount',
      width: '110px'
    },
    {
      name: 'Nr. Débito',
      selector: 'debitNumber',
      width: '150px'
    },
    {
      name: 'Nosso Número',
      selector: 'ourNumber',
      width: '150px'
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
      name: 'CPF/CNPJ',
      selector: 'vatNumber',
      width: '150px'
    },
    {
      name: 'Pagador',
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

const TabDebits = ({ data }) => {
  return (
    <TabContainer>
      <DataTable
        columns={columns}
        data={{ rows: data.debits || [] }}
        noPagination={true}
        emptyText="Nenhum débito automático vinculado"
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

export default TabDebits;
