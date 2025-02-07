import _ from 'lodash';
import React from 'react';
import Modal from '~/components/modal';
import { SalesStatusMapping } from '~/constants';
import { HiOutlineExternalLink } from 'react-icons/hi';
import DataTable from '~/components/datatable';
import { IconButton } from '~/components/crud/styles';
import { formats } from '~/helper';
import { ModalContainer } from '~/views/dashboards/styles';

const columns = [
    {
      name: 'Origem',
      selector: 'source',
      width: '120px',
      format: (row) => `${_.capitalize(row.source)}`
    },
    {
      name: 'Agrupamento',
      selector: 'tag',
      width: '120px',
      format: (row) => `${_.capitalize(row.tag)}`
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId',
      width: '120px',
    },
    {
      name: 'Status',
      selector: 'status',
      width: '120px',
      format: (row) => SalesStatusMapping[row.status] || ''
    },
    {
      name: 'Dt.Venda',
      selector: 'taxDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'taxDate'), 'dd/MM/yyyy')
    },
    {
      name: 'CPF',
      selector: 'vatNumber',
      width: '150px',
      format: (row) => formats.cnpj_cpf(row.vatNumber)
    },
    {
      name: 'Associado',
      wrap: true,
      selector: 'name'
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
      width: '50px',
      center: true,
      cell: (row) => <>
        {row.url &&
          <IconButton size={28} title="Ver detalhes" onClick={() => window.open(row.url, '_blank')}>
            <HiOutlineExternalLink />
          </IconButton>
        }
      </>
    },
]

function SalesModal({ title, isOpen, loading, data, filter, loadList, openDetail, closeModal }) {
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
            emptyText="Nenhuma transação encontrada"
            data={data}
            onChangePage={onChangePage}
            loading={loading}
            columns={columns}
            onRowClicked={openDetail}
            />
        </div>
      </ModalContainer>
    </Modal>
  );
}

export default SalesModal;
