import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import { gray, accent, secondary, tertiary } from '~/components/mixins/color';

const Component = styled.input`
  background: ${secondary.hex()};
  border: 2px solid ${tertiary.hex()};
  border-radius: 3px;
  padding: 8px 10px;
  height: 46px;
  margin-bottom: ${(props) => props.noMargin ? 0 : 10}px;
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

const hasVal = (val) => {
  return !_.isUndefined(val) && !_.isNull(val) && val !== '';
};

const InputRaw = ({type, value, name, noMargin, hasError, ...rest}) => (
  <Component
    noMargin={noMargin}
    type={type}
    value={hasVal(value) ? value : ''}
    className={!!hasError ? 'error' : ''}
    {...rest} />
);

InputRaw.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  noMargin: PropTypes.bool,
}

InputRaw.defaultProps = {
  hasError: false
}

export default InputRaw;