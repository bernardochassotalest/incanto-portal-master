import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { gray } from '~/components/mixins/color';

const Container = styled.label`
  display: flex;

  input[type='checkbox'] {
    margin-right: 5px;
    width: 15px;
    height: 15px;
    display: inline-block;
  }
  input[type='checkbox']:disabled,
  span.disabled {
    color: ${gray.hex()};
  }
`;

const Checkbox = (props) => (
  <Container>
    <Field
      type='checkbox'
      id={props.id}
      value={props.value}
      disabled={props.disabled}
      name={props.name}
    />
    {props.label && <span className='disabled'>{props.label}</span>}
  </Container>
);

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasError: PropTypes.bool,
};

export default Checkbox;
