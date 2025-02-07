import styled from 'styled-components';
import { accent, gray, primary, secondary, symbol, tertiary } from '~/components/mixins/color';

export const Container = styled.div`
  height: 100%;
  max-height: ${(props) => props.maxHeight};
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;

  @media (max-width: 425px) {
    max-height: 100%;
  }
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100%);
  overflow: hidden;

  h3 {
    color: ${gray.fade(0.6).string()};
    font-size: 22px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 10px;
  height: calc(100% - 10px);
`;

export const InputItem = styled.div`
  display: grid;
  position: relative;
  margin: 0 0 10px;
  width: 100%;

  & > svg {
    position: absolute;
    right: 15px;
    align-self: center;
    color: ${symbol.hex()};
    transition: color 0.2s ease 0s;
  }

  &:focus-within > input {
    border-color: ${accent.hex()};
  }

  &:focus-within > svg {
    color: ${accent.hex()};
  }

  input {
    background: ${secondary.hex()};
    border: 2px solid ${secondary.hex()};
    border-radius: 3px;
    padding: 22px 40px 8px 10px;
    color: ${gray.hex()};
    position: relative;
    transition: border-color 0.2s ease-in 0s;

    &:focus + label,
    &:not([value='']) + label {
      font-size: 70%;
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      top: 20px;
    }
    &:not([value='']) + label {
      color: ${gray.hex()};
    }
    & + label {
      position: absolute;
      top: 15px;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
      opacity: 0.7;
    }
  }
`;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  padding: 15px;
  background: ${primary.hex()};
  border: 2px solid ${tertiary.hex()};
  border-radius: 3px;
  color: ${gray.hex()};

  &:hover {
    background-color: ${secondary.hex()};
  }

  & > svg {
    color: ${symbol.hex()};
    transition: color 0.2s ease 0s;

    &:hover {
      color: ${accent.hex()};
      cursor: pointer;
    }
  }

  & .column-data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-right: 30px;

    .first {
      display: flex;
      flex-direction: column;
    }
  }
`;
