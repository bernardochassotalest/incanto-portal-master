import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import styled from 'styled-components';

import Modal from '~/components/modal';
import { InputGroup } from '~/components/form';

const Container = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;

  span {
    color: #d61305;
    margin: 0 0 10px;
  }
`;

function BasicForm({ title, data, isOpen, closeModal, handleOnSubmit, handleCancelling }) {

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={schema}
      onSubmit={handleOnSubmit}
      >
      {({ errors, isValid, touched, handleSubmit, isSubmitting, handleReset }) => (
        <Modal
          width="400px"
          height="200px"
          open={isOpen}
          title={title}
          hideClose={true}
          onClose={closeModal}
          actions={[
            {
              label: "Cancelar",
              action: () => { handleReset() ; closeModal() },
              disabled: isSubmitting
            },
            {
              label: isSubmitting ? "Aguarde..." : "Enviar",
              action: handleSubmit,
              type: 'submit',
              primary: true,
              disabled: !isValid || isSubmitting
            }
          ]}
          >
          <Container>
              <InputGroup
                type='text'
                name='name'
                label='Nome'
                maxLength={100}
                hasError={errors.name && touched.name}
                />
          </Container>
        </Modal>
      )}
    </Formik>
  );
}

const schema = Yup.object().shape({
  name: Yup.string().min(4, 'Verifique se o nome está correto').required('Informar o nome')
});

BasicForm.propTypes = {
  title: PropTypes.node,
  data: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func,
  handleCancelling: PropTypes.func
};

BasicForm.defaultProps = {
  isOpen: false,
  handleOnSubmit: () => {},
  handleCancelling: () => {}
};

export default BasicForm;
