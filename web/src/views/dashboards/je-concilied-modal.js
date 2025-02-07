import _ from 'lodash';
import React from 'react';
import Modal from '~/components/modal';
import DataTable from '~/components/datatable';
import { formats } from '~/helper';
import { ModalContainer } from '~/views/dashboards/styles';

const typeMapping = {
    account: 'Contábil',
    finance: 'Financeira',
  };

const columns = ({ filter }) => [
    {
      name: 'Tipo',
      selector: 'type',
      width: '150px',
      format: (row) => typeMapping[row.type || ''],
    },
    {
      name: 'Conta Contábil',
      selector: 'acctCode',
      format: (row) => `${_.get(row, 'acctCode', '')} - ${_.get(row, 'acctName', '')}`
    },
    {
      name: 'Parceiro de Negócio',
      selector: 'cardCode',
      format: (row) => _.get(row, 'cardCode') && `${_.get(row, 'cardCode', '')} - ${_.get(row, 'cardName', '')}`
    },
    {
      name: 'Débito',
      selector: 'debit',
      right: true,
      width: '160px',
      format: (row) => formats.currency(row.debit || 0)
    },
    {
      name: 'Crédito',
      selector: 'credit',
      right: true,
      width: '160px',
      format: (row) => formats.currency(row.credit || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '160px',
      format: (row) => formats.currency(row.balance || 0)
    },
]


function JeConciliedModal({ title, isOpen, loading, data, filter, loadList, closeModal }) {
  const onChangePage = (offset) => {
    loadList({ offset, ...filter });
  }
  return (
    <Modal
      width="95%"
      height="90%"
      open={isOpen}
      title={title}
      hideClose={false}
      onClose={closeModal}
      >
      <ModalContainer>
        <div className="bills-panel">
          <DataTable
            emptyText="Nenhuma conta contábil encontrada"
            data={data}
            onChangePage={onChangePage}
            loading={loading}
            columns={columns({filter})}
            />
        </div>
      </ModalContainer>
    </Modal>
  );
}

export default JeConciliedModal;
