import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from './styles';

export default function Portal({ children }) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
}

Portal.propTypes = {
  children: PropTypes.element.isRequired
};
