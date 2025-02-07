import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import FileImageCrop from '~/components/form/file-image-crop';
import Modal from '~/components/modal';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

function AvatarForm({ title, data, isOpen, closeModal, handleOnSubmit }) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      onSubmit={handleOnSubmit}
      >
      {({ handleReset, handleSubmit, isSubmitting }) => (
        <Modal
          width='450px'
          height='500px'
          open={isOpen}
          title={title}
          hideClose={true}
          onClose={closeModal}
          actions={[
            {
              label: 'Cancelar',
              action: () => {
                handleReset();
                closeModal();
              },
              disabled: isSubmitting,
            },
            {
              label: isSubmitting ? 'Aguarde...' : 'Enviar',
              action: handleSubmit,
              type: 'submit',
              primary: true,
              disabled: isSubmitting,
            },
          ]}
        >
          <Container>
            <FileImageCrop
              label='Clique aqui para selecionar sua foto'
              name='avatar'
              aspect={1}
              height={'100%'}
              />
          </Container>
        </Modal>
      )}
    </Formik>
  );
}

AvatarForm.propTypes = {
  title: PropTypes.node,
  data: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func,
};

AvatarForm.defaultProps = {
  isOpen: false,
  handleOnSubmit: () => {},
};

export default AvatarForm;
