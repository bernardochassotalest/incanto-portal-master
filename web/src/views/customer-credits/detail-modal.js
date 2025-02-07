import React from 'react';
import Modal from '~/components/modal';
import { ModalContainer } from '~/views/customer-credits/styles';
import Spinner from '~/components/spinner';
import { CustomerCreditForm } from '~/views/customer-credits/form';

function DetailModal({ title, isOpen, loading, data, closeModal, ...rest }) {
  return (
    <Modal
      width="900px"
      height="50%"
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
          <CustomerCreditForm rows={data} {...rest} />
        }
      </ModalContainer>
    </Modal>
  );
};

export default DetailModal;
