import { Form } from 'formik';
import styled from 'styled-components';
import { accent, primary, secondary, symbol, tertiary, white } from '~/components/mixins/color';

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

export const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 260px);
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const NestedDiv = styled.div`
  margin-left: 20px;
   border-left: 1px solid ${secondary.darken(0.2).string()};
`;

export const TreeNode = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .name-box {
    flex: 1;
  }
  .name {
    padding-top: 10px;
  }
  .order {
    flex: 0 0 80px;
    margin-top: 10px;
  }
  .actions {
    display: flex;
    flex: 0 0 90px;
    margin-top: 18px;
    flex-direction: row;
    justify-content: center;
  }
`;

export const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 10px;
  overflow: hidden;
  height: calc(100vh - 184px);
  span {
    margin: 0 0 10px;
  }
`;

export const Item = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  padding: 15px;
  background: ${primary.hex()};
  border: 2px solid ${tertiary.hex()};
  border-radius: 3px;
  color: ${white.hex()};

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

  & > .paid {
    color: #53d449;
  }
  & > .late {
    color: #e80000;
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
