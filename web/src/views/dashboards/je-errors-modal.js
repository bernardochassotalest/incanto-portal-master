import _ from 'lodash';
import React from 'react';
import Modal from '~/components/modal';
import { HiRefresh } from 'react-icons/hi';
import DataTable from '~/components/datatable';
import { IconButton } from '~/components/crud/styles';
import { formats } from '~/helper';
import { ModalContainer } from '~/views/dashboards/styles';

const columns = ({ resend, filter }) => [
    {
      name: 'Agrupamento',
      selector: 'tag',
      width: '100px',
    },
    {
      name: 'Tipo Lançamento',
      selector: 'group',
      width: '280px',
    },
    {
      name: 'Dt.Lançamento',
      selector: 'refDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'refDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Dt.Documento',
      selector: 'taxDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'taxDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Dt.Vencimento',
      selector: 'dueDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'dueDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Valor',
      selector: 'locTotal',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.locTotal || 0)
    },
    {
      name: 'Mensagem',
      wrap: true,
      selector: 'logMessage'
    },
    {
      name: 'Ações',
      width: '50px',
      center: true,
      cell: (row) => <>
        <IconButton size={28} title={'Reenviar'} onClick={() => resend({id: row.id}, filter)}>
          <HiRefresh />
        </IconButton>
      </>
    },
]


function JeErrorsModal({ title, isOpen, loading, data, filter, loadList, resend, closeModal }) {
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
            columns={columns({resend, filter})}
            />
        </div>
      </ModalContainer>
    </Modal>
  );
}

export default JeErrorsModal;
