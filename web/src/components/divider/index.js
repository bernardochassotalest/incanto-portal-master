import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Hr = styled.hr`
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: #000;
  text-align: center;
  height: 1.5em;
  opacity: .5;
  margin: 5px 0px;

  &:before {
    content: '';
    background: linear-gradient(to right, transparent, #000, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }

  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: #000;
    padding: 0 .5em;
    line-height: 1.5em;
    color: #000;
    background-color: #fcfcfa;
  }
`;

const Divider = (props) => {
  const { label } = props
  return <div><Hr data-content={label} /></div>
}

Divider.propTypes = {
  label: PropTypes.string,
}

Divider.defaultProps = {
  label: ''
}

export default Divider;
