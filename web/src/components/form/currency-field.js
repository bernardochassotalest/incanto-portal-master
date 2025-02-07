import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';
import CurrencyInput from 'react-currency-input';
import styled, { css } from 'styled-components';
import { accent, gray, secondary } from '~/components/mixins/color';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Group = styled.div`
  display: grid;
  position: relative;
  margin: 0 0 10px;

  & > svg {
    position: absolute;
    right: 15px;
    align-self: center;
    color: #555;
  }

  &:focus-within > svg {
    color: ${accent.hex()};
  }

  ${(props) => props.required && css`
    label {
      font-weight: 800;
    }
  `};

  input {
    background: ${secondary.hex()};
    border: 2px solid ${secondary.hex()};
    border-radius: 4px;
    height: 46px;
    padding: 20px 0 8px 10px;
    color: ${gray.hex()};
    text-align: left;

    &:focus {
      border-color: ${accent.hex()};
    }

    &:disabled {
      opacity: 0.75;
    }

    &:focus + label,
    &:not([value=""]) + label {
      font-size: 70%;
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      top: 18px;
    }
    &:not([value=""]) + label {
      color: ${gray.hex()};
    }
    &:focus + label {
      color: ${gray.hex()};
    }
    &:focus::placeholder {
      color: ${gray.hex()};
    }
    & + label {
      position: absolute;
      top: 15px;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
      opacity: 0.75;
    }
  }
`;

const CurrencyField = ({name, label='', icon: Icon, hideErrorLabel, required, onChange, hasError, ...rest }) => (
  <Container>
    <Field type="text" id={name} name={name}>
      {
        ({field, form}) => (
          <Group required={required}>
            <CurrencyInput
              decimalSeparator=','
              thousandSeparator='.'
              {...field}
              {...rest}
              onChangeEvent={onChange || form.handleChange}
              placeholder={`${label}${required ? ' (*)' : ''}`}
              className={!!hasError ? "error" : ""}
              value={field.value || ''}
            />
            <label htmlFor={name}>{label}{required ? ' (*)' : ''}</label>
            { Icon && <Icon size={20} /> }
          </Group>
        )
      }
    </Field>
    {!hideErrorLabel && <ErrorMessage name={name} className="error" component="div" />}
  </Container>
);

CurrencyField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasError: PropTypes.bool,
}

CurrencyField.defaultProps = {
  hasError: false
}

export default CurrencyField;

// EXEMPLO DE USO
// <CurrencyField
//     name="value"
//     label="Total"
//     hasError={errors.value && touched.value} />
