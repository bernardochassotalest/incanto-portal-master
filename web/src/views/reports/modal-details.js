import React from 'react';
import _ from 'lodash';
import Modal from '~/components/modal';
import { ModalContainer, Contents, Overlay } from '~/views/reports/styles';
import { formats } from '~/helper';
import DataTable from '~/components/datatable';

const columnsDetails = [
  {
    name: 'Nr.LCM',
    selector: 'journalEntries',
    width: '150px',
    format: (row) => _.get(row, 'journalEntries.transId')
  },
  {
    name: 'Tag',
    width: '110px',
    selector: 'journalEntries',
    format: (row) => _.get(row, 'journalEntries.tag')
  },
  {
    name: 'Dt.Lançamento',
    selector: 'journalEntries',
    center: true,
    width: '130px',
    format: (row) => formats.dateTimeZone(_.get(row, 'journalEntries.refDate'), 'dd/MM/yyyy')
  },
  {
    name: 'Dt.Venda',
    selector: 'journalEntries',
    center: true,
    width: '110px',
    hide: 'md',
    format: (row) => formats.dateTimeZone(_.get(row, 'journalEntries.taxDate'), 'dd/MM/yyyy')
  },
  {
    name: 'Dt.Vencimento',
    selector: 'journalEntries',
    center: true,
    width: '110px',
    format: (row) => formats.dateTimeZone(_.get(row, 'journalEntries.dueDate'), 'dd/MM/yyyy')
  },
  {
    name: 'Vl.Débito',
    selector: 'debit',
    width: '120px',
    right: true,
    format: (row) => formats.decimal(_.get(row, 'debit'))
  },
  {
    name: 'Vl.Crédito',
    selector: 'credit',
    width: '120px',
    right: true,
    format: (row) => formats.decimal(_.get(row, 'credit'))
  },
  {
    name: 'Saldo',
    selector: 'credit',
    width: '120px',
    right: true,
    format: (row) => formats.decimal(_.get(row, 'credit'))
  },
  {
    name: 'Detalhes',
    wrap: true,
    hide: 'md',
    selector: 'memo'
  },
  {
    name: 'Usuário',
    selector: 'journalEntries',
    width: '150px',
    format: (row) => _.get(row, 'journalEntries.user.name')
  },
];

function DetailModal({ data = {}, movementData = [], isOpen, loading, exporToXlsx, closeModal }) {

  return (
    <Modal
      width="98%"
      height="95%"
      open={isOpen}
      onClose={closeModal}
      hideClose={true}
      title={<span>Detalhamento - {_.get(data, 'source.name')}</span>}
      actions={[
        {
          label: 'Exportar planilha',
          action: exporToXlsx,
          disabled: loading
        },
        {
          label: 'Fechar',
          action: closeModal,
          disabled: loading
        }
      ]}
      >
      <ModalContainer>
        <Contents openDetail={false}>
          <div className='master'>
            <Overlay visible={loading} />
            <DataTable
              emptyText="Nenhum detalhamento encontrado"
              noPagination={true}
              data={{ rows: _.get(data, 'list') || [] }}
              loading={loading}
              columns={columnsDetails}
              onRowClicked={_.noop}
              />
          </div>
        </Contents>
      </ModalContainer>
    </Modal>
  );
}

export default DetailModal;
