import { ErrorMessage, Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { accent, gray, secondary, tertiary } from '~/components/mixins/color';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Group = styled.div`
  display: grid;
  position: relative;
  margin: 0 0 10px;

  &:focus-within > textarea {
    border-color: ${accent.hex()};
  }

  textarea {
    background: ${secondary.hex()};
    border: 2px solid ${tertiary.hex()};
    border-radius: 3px;
    padding: 22px 0 8px 10px;
    color: ${gray.hex()};
    transition: border-color 0.2s ease-in 0s;
    resize: none;

    &:disabled {
      opacity: 0.75;
    }

    &:focus + label,
    &:not([value='']) + label {
      font-size: 70%;
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      top: 20px;
    }
    & + label {
      position: absolute;
      top: 15px;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
    }
  }
`;

const TextArea = ({ name, label = '', hasError, ...rest }) => (
  <Container>
    <Field type='text' id={name} name={name}>
      {({ field }) => (
        <Group>
          <textarea
            {...field}
            {...rest}
            className={!!hasError ? 'error' : ''}
            placeholder={label}
            />
          {field.value && <label htmlFor={name}>{label}</label>}
        </Group>
      )}
    </Field>
    <ErrorMessage name={name} className='error' component='div' />
  </Container>
);

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasError: PropTypes.bool,
};

TextArea.defaultProps = {
  hasError: false,
};

export default TextArea;

// EXEMPLO DE USO
//
// import { TextArea } from '~/components/form';
//
// <TextArea
//     name="obervation"
//     label="Observações"
//     rows={3}
//     hasError={errors.obervation && touched.obervation} />
