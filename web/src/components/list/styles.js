import styled, { css } from 'styled-components';
import {
  accent,
  quaternary,
  secondary,
  symbol,
  white,
} from '~/components/mixins/color';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .left {
    display: flex;
    flex: 1;
  }

  .right {
    display: flex;
    position: relative;
    flex: 0 0 25%;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 10px 0 10px;
    background: ${quaternary.hex()};
    margin-left: 10px;
    border-radius: 3px;
    opacity: 0;
    transition: opacity 1s ease-out;
  }

  ${(props) =>
    props.showForm &&
    css`
      .right {
        opacity: 1;
      }
      @media (max-width: 1024px) {
        .left {
          display: none;
          visibility: hidden;
        }
        .right {
          flex: 1;
          margin-left: 0px;
        }
      }

      @media (min-width: 769px) and (max-width: 1024px) {
        .right {
          flex: 0 0 20%;
        }
      }
    `}
`;

export const FormToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  height: 56px;
  border-top: 1px solid ${secondary.hex()};

  .buttons {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  margin: 5px 0px 5px 5px;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 3px;
  font-size: 20px;

  background: transparent;
  border: 1px solid ${symbol.hex()};
  color: ${white.hex()};

  &:hover:enabled,
  &:focus:enabled {
    color: ${white.hex()};
    background: ${accent.hex()};
  }
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      user-select: none;
      font-weight: normal;
    `}
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: ${(props) => (props.visible ? 'grid' : 'none')};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.visible ? '1' : '0')};
  transition: 0.1s;
  z-index: 3;
`;
