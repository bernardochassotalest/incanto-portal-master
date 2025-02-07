import React from 'react';
import Modal from '~/components/modal';
import { ModalContainer } from '~/views/sales/styles';
import Spinner from '~/components/spinner';
import DetailPanel from '~/views/sales/details';

function DetailModal({ title, isOpen, loading, data, closeModal }) {
  return (
    <Modal
      width="98%"
      height="95%"
      noPadding={true}
      open={isOpen}
      title={title}
      hideClose={false}
      onClose={closeModal}
      >
      <ModalContainer>
        { loading ?
          <Spinner visible={true} />
          :
          <DetailPanel data={data} />
        }
      </ModalContainer>
    </Modal>
  );
};

export default DetailModal;
