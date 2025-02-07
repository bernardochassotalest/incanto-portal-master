import _ from 'lodash';
import React from 'react';
import Modal from '~/components/modal';
import { HiBadgeCheck } from 'react-icons/hi';
import DataTable from '~/components/datatable';
import { IconButton } from '~/components/crud/styles';
import { ModalContainer } from '~/views/dashboards/styles';

const columns = ({ confirm, filter }) => [
    {
      name: 'Tipo Mensagem',
      selector: 'group',
      width: '310px',
    },
    {
      name: 'Mensagem',
      wrap: true,
      selector: 'description'
    },
    {
      name: 'Ações',
      width: '50px',
      center: true,
      cell: (row) => <>
        <IconButton size={28} title={'Confirmar'} onClick={() => confirm({id: _.get(row, 'id', '')}, filter)}>
          <HiBadgeCheck />
        </IconButton>
      </>
    },
]


function MessagesModal({ title, isOpen, loading, data, filter, loadList, confirm, closeModal }) {
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
            columns={columns({confirm, filter})}
            />
        </div>
      </ModalContainer>
    </Modal>
  );
}

export default MessagesModal;
