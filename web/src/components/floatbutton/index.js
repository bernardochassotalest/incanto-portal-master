import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import elevation, { elevationTransition } from '~/components/mixins/elevation';
import ripple from '~/components/mixins/ripple';
import { accent } from '~/components/mixins/color';

const mini = css`
  height: 40px;
  width: 40px;
`;

const disabled = css`
  ${elevation(2)};
  &:active {
    ${elevation(8)};
  }
  color: #555 !important;
  background: rgba(0, 0, 0, 0.12) !important;
  pointer-events: none;
`;

const FloatingActionButton = styled.button.attrs({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })`
  overflow: hidden;
  user-select: none;
  outline: none;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 50%;
  box-sizing: border-box;
  -webkit-appearance: none;
  z-index: 1;

  &:active {
    outline: none;
  }
  &:hover {
    cursor: pointer;
    overflow: hidden;
  }
  &::-moz-focus-inner {
    padding: 0;
    border: 0;
  }

  svg {
    align-self: center;
    stroke-width: 1px;
  }

  ${elevationTransition}
  ${ripple()}
  ${props => props.disabled && disabled}
  ${props => props.mini && mini}

  font-size: 24px;
  position: fixed;
  width: ${props => (props.size ? props.size : '60')}px;
  height: ${props => (props.size ? props.size : '60')}px;
  color: ${props => (props.color ? props.color : '#fff')};
  background: ${props => (props.background ? props.background : accent.hex())};
  right: ${props => (props.right ? `${props.right}px` : '20px')};
  bottom: ${props => (props.bottom ? `${props.bottom}px` : '20px')};
`;

const Button = ({icon: Icon, ...rest}) => (
  <FloatingActionButton {...rest}>
    <Icon />
  </FloatingActionButton>
)

Button.propTypes = {
  disabled: PropTypes.bool,
  background: PropTypes.string,
  icon: PropTypes.func,
  mini: PropTypes.bool
};

Button.defaultProps = {
  disabled: false,
  mini: false
};

export default Button;
