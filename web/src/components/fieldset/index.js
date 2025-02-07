import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.fieldset`
  border: 1px solid #e9e9e9;
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  legend {
    color: #666;
    font-size: 12px;
    padding: 0 10px;
  }
  ${(props) => props.clickable && css`
    cursor: pointer;
    & * {
      cursor: pointer;
    }
    &:hover {
      opacity: 0.8;
    }
  `}
`;

const Fieldset = ({ label, clickable, onClick, children }) => {
  return (
    <Container clickable={clickable} onClick={onClick}>
      <legend>{label}</legend>
      {children}
    </Container>
  );
};

export default Fieldset;
