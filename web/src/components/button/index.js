import styled, { css } from 'styled-components';
import { accent, secondary, white } from '~/components/mixins/color';
import PropTypes from 'prop-types';

const Button = styled.button`
  color: ${(props) => props.primary ? '#fff' : '#555'};
  border: 1px solid ${(props) => props.primary ? accent.hex() : secondary.hex()};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0px 5px 5px;
  padding: 0px 14px;
  height: 40px;
  font-weight: bold;
  font-size: 15px;
  min-width: 100px;
  transition: background 0.2s;
  background: ${(props) => props.primary ? accent.hex() : secondary.hex()};

  &:hover:enabled, &:focus:enabled {
    background: ${(props) => props.primary ? accent.lighten(0.15).hex() : white.darken(0.15).hex()};
  }

  ${(props) =>
    css`svg { margin-${(typeof props.children[0] === 'string') ? 'left' : 'right'}: 5px; } `
  }
  ${(props) => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    user-select: none;
    font-weight: normal;
  `}
`

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

export default Button;
