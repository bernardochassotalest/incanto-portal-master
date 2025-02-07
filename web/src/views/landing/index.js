import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import * as Yup from 'yup';
import useEventListener from '~/hooks/use-event-listener';
import useAuth from '~/view-data/use-auth';
import { Container, Contents, Link, FormContainer, Version, ImageBackground } from '~/views/landing/styles';
import Button from '~components/button';
import { InputGroup } from '~components/form';
import Logo from '~components/logo';

const schema = Yup.object().shape({
  email: Yup.string().required('O usuário é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

const forgetSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('O email é obrigatório'),
});

export default function Landing() {
  const { state, actions } = useAuth(),
    signInButton = useRef(null),
    forgetPassButton = useRef(null);

  const onKeyDown = (event) => {
    let btnRef = state.isLoginMode
      ? signInButton.current
      : forgetPassButton.current;
    if (event.keyCode === 13 && btnRef && !btnRef.disabled) {
      event.preventDefault();
      btnRef.click();
    }
  };

  useEventListener({ name: 'keydown', handler: onKeyDown });

  const renderLogin = ({ errors, isValid, touched, values }) => {
    return (
      <>
        <Logo height="120px" />

        <InputGroup
          type='email'
          name='email'
          label='E-Mail'
          autoComplete='new-password'
          autoFocus
          maxLength={100}
          value={values.email}
          hideErrorLabel={true}
          hasError={errors.email && touched.email}
        />

        <InputGroup
          type='password'
          name='password'
          label='Senha'
          maxLength={50}
          autoComplete='new-password'
          value={values.password}
          hideErrorLabel={true}
          hasError={errors.password && touched.password}
        />

        <Link
          onClick={() => actions.changeLoginMode(false)}
        >
          Esqueci minha senha
        </Link>

        <Button
          ref={signInButton}
          type='submit'
          disabled={!isValid}
          primary={true}
        >
          Entrar
        </Button>
      </>
    );
  };

  const renderForgetPassword = ({ errors, isValid, touched, values }) => {
    return (
      <>
        <InputGroup
          type='email'
          name='email'
          label='Email'
          autoFocus
          autoComplete='new-password'
          value={values.email}
          hasError={errors.email && touched.email}
        />

        <Link onClick={() => actions.changeLoginMode(true)}>
          Voltar para o Login
        </Link>

        <Button
          ref={forgetPassButton}
          type='submit'
          disabled={!isValid}
          primary={true}
        >
          Redefinir senha
        </Button>
      </>
    );
  };

  return (
    <Container>
      <ImageBackground />
      <Version>Versão: v{process.env.REACT_APP_VERSION}</Version>
      <Contents>
        <Formik
          validateOnMount={true}
          enableReinitialize={true}
          initialValues={state.loginData || {}}
          validationSchema={state.isLoginMode ? schema : forgetSchema}
          onSubmit={state.isLoginMode ? actions.loginSubmit : actions.forgetPasswordSubmit}
          initialTouched={state.isLoginMode ? { email: true } : {}}
          >
          {(formArgs) => (
            <FormContainer>
              <Form>
                {state.isLoginMode && renderLogin(formArgs)}
                {!state.isLoginMode && renderForgetPassword(formArgs)}
              </Form>
            </FormContainer>
          )}
        </Formik>
      </Contents>
    </Container>
  );
}
