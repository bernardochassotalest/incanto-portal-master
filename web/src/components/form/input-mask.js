import { ErrorMessage, Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import Cleave from 'cleave.js/react';
import styled, { css } from 'styled-components';
import { accent, gray, secondary, tertiary } from '~/components/mixins/color';
import 'cleave.js/dist/addons/cleave-phone.br';

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

  &:focus-within > input {
    border-color: ${accent.hex()};
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
    border: 2px solid ${tertiary.hex()};
    border-radius: 4px;
    padding: 22px 0 8px 10px;
    height: 46px;
    color: ${gray.hex()};
    transition: border-color 0.2s ease-in 0s;

    &:disabled {
      opacity: 0.75;
    }

    &:focus + label,
    &:not([value=""]) + label {
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

const InputMask = ({ name, label = '', required, hideErrorLabel, mask = {}, hasError, icon: Icon, className, ...rest }) => (
  <Container>
    <Field type="text" id={name} name={name}>
      {({ field }) => (
        <Group required={required}>
          <Cleave
            {...field}
            {...rest}
            placeholder={`${label}${required ? ' (*)' : ''}`}
            options={mask}
            className={!!hasError ? 'error' : ''}
            value={field.value || ''}
            style={field.value ? {} : { padding: "15px 8px" }}
            onChange={(event) => {
              const tempEvent = event;
              tempEvent.target.value = event.target.rawValue;
              field.onChange(tempEvent);
            }}
            />
          {field.value && <label htmlFor={name}>{label}{required ? ' (*)' : ''}</label>}
          {Icon && <Icon size={20} />}
        </Group>
      )}
    </Field>
    {!hideErrorLabel && <ErrorMessage name={name} className='error' component='div' /> }
  </Container>
);

InputMask.propTypes = {
  name: PropTypes.string.isRequired,
  mask: PropTypes.object.isRequired,
  label: PropTypes.string,
  hasError: PropTypes.bool,
};

InputMask.defaultProps = {
  hasError: false,
};

export default InputMask;

// EXEMPLO DE USO
// <InputMask
//     mask={MASK_PHONE}
//     name="phone"
//     label="Telefone"
//     hasError={errors.phone && touched.phone} />
