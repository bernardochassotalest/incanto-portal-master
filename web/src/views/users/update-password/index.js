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

function PasswordForm({ title, data, isOpen, closeModal, handleOnSubmit, handleCancelling }) {

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
          height="370px"
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
                type="password"
                name="oldPassword"
                label="Senha atual"
                autoFocus
                maxLength={20}
                hasError={errors.oldPassword && touched.oldPassword} />

              <InputGroup
                type="password"
                name="password"
                label="Nova senha"
                maxLength={20}
                hasError={errors.password && touched.password} />

              <InputGroup
                type="password"
                name="confirmPassword"
                label="Confirmação de  senha"
                maxLength={20}
                hasError={errors.confirmPassword && touched.confirmPassword} />
          </Container>
        </Modal>
      )}
    </Formik>
  );
}

const schema = Yup.object().shape({
  oldPassword: Yup.string().required('Informe a sua senha atual'),
  password: Yup.string().required('Informe a sua nova senha'),
  confirmPassword: Yup.string().required('Confirme a sua nova senha')
});

PasswordForm.propTypes = {
  title: PropTypes.node,
  data: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func,
  handleCancelling: PropTypes.func
};

PasswordForm.defaultProps = {
  isOpen: false,
  handleOnSubmit: () => {},
  handleCancelling: () => {}
};

export default PasswordForm;
