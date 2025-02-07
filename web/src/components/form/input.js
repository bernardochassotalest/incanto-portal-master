import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import { gray, accent, secondary, tertiary } from '~/components/mixins/color';

const Component = styled.input`
  background: ${secondary.hex()};
  border: 2px solid ${tertiary.hex()};
  border-radius: 3px;
  padding: 8px 10px;
  height: 46px;
  margin-bottom: 10px;
  width: 100%;
  color: ${gray.hex()};
  position: relative;
  transition: border-color 0.2s ease-in 0s;

  &:focus-within {
    border-color: ${accent.hex()};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Input = ({type, name, hasError, ...rest}) => (
  <>
    <Field
      id={name}
      name={name}
      >
      {({field}) => (
        <Component
          type={type}
          value={field.value || ''}
          className={!!hasError ? "error" : ""}
          {...field}
          {...rest} />
      )}
    </Field>
    <ErrorMessage name={name} className="error" component="div" />
  </>
);

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
}

Input.defaultProps = {
  hasError: false
}

export default Input;