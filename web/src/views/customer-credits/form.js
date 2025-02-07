import React from 'react';
import _ from 'lodash';
import { formats } from '~/helper';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IconButton } from '~/components/crud/styles';
import DataTable from '~/components/datatable';
import { FormContainer } from '~/views/customer-credits/styles';
import DetailModal from '~/views/sales/detail-modal';

const columns = [
    {
      name: 'Tag',
      selector: 'tag'
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId'
    },
    {
      name: 'Nr.Cobrança',
      selector: 'chargeId'
    },
    {
      name: 'Dt.Crédito',
      selector: 'taxDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'taxDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.balance || 0)
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

export const CustomerCreditForm = ({ rows, isOpenBillDetailModal, billDetailModalLoading, billsDetail, billsDetailTab, openBillDetailModal, changeBillsDetailTab, closeBillDetailModal }) => {
  return (
    <FormContainer>
      <DataTable
        emptyText="Nenhum registro encontrado"
        noPagination={true}
        data={{ rows }}
        keyField="id"
        columns={columns}
        onRowClicked={openBillDetailModal}
        extraOptions={{
          compact: true,
          ignoreRowClicked: true,
          highlightOnHover: false,
          selectableRows: false,
        }}
        />

      <DetailModal
        title={<span>Detalhes da Venda</span>}
        isOpen={isOpenBillDetailModal}
        loading={billDetailModalLoading}
        data={billsDetail}
        tab={billsDetailTab}
        changeTab={changeBillsDetailTab}
        closeModal={() => { closeBillDetailModal() }}
        />

    </FormContainer>
  );
};

