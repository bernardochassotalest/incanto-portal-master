import React from 'react';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import { ErrorMessage, Field } from 'formik';
import PropTypes from 'prop-types';
import { secondary, accent, gray } from '~/components/mixins/color';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Group = styled.div`
  display: grid;
  position: relative;
  margin: ${(props) => props.noMargin ? '0' : '0 0 10px'};
  width: 100%;

  & > svg,
  & > .addon {
    position: absolute;
    right: 15px;
    align-self: center;
    color: ${gray.hex()};
    transition: color 0.2s ease 0s;
  }

  &:focus-within > input {
    border-color: ${accent.hex()};
  }

  &:focus-within > svg,
  &:focus-within > .addon {
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
    border-radius: 3px;
    padding: ${(props) => props.hasIcon ? '22px 40px 8px 10px' : '22px 10px 8px 10px'};
    color: ${gray.hex()};
    height: 46px;
    position: relative;
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
      color: ${gray.hex()};
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
      opacity: 0.75;
    }
  }
`;

const hasVal = (val) => {
  return !_.isUndefined(val) && !_.isNull(val) && val !== '';
};

const InputGroup = ({ type, name, label, required, hideErrorLabel, noMargin, hasError, icon: Icon, innerRef, ...rest }) => {
  return (
    <Container>
      <Field id={name} name={name}>
        {({ field }) => (
          <Group required={required} noMargin={noMargin} hasIcon={!!Icon}>
            <input
              {...field}
              {...rest}
              ref={innerRef}
              type={type}
              className={!!hasError ? 'error' : ''}
              placeholder={`${label}${required ? ' (*)' : ''}`}
              value={hasVal(field.value) ? field.value : ''}
              style={hasVal(field.value) ? {} : { padding: '15px 8px' }}
            />
            {hasVal(field.value) && <label htmlFor={name}>{label}{required ? ' (*)' : ''}</label>}
            {Icon && <Icon size={20} />}
          </Group>
        )}
      </Field>
      {!hideErrorLabel && <ErrorMessage name={name} className='error' component='div' /> }
    </Container>
  );
};

InputGroup.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasError: PropTypes.bool,
  noMargin: PropTypes.bool,
  icon: PropTypes.func,
};

InputGroup.defaultProps = {
  hasError: false,
};

export default React.memo(InputGroup);
