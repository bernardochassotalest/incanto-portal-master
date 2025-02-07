import styled, { css } from 'styled-components';
import { white, accent, lightGray, quinary } from '~/components/mixins/color'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .left {
    display: flex;
    flex: 1;
    width: calc(100% - ${(props) => props.rightWidth || '35%'} - 40px);
  }
  .right {
    display: flex;
    position: relative;
    flex: 0 0 ${(props) => props.rightWidth || '35%'};
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    background: #fff;
    margin-left: 10px;
    border-radius: 3px;
    opacity: 0;
    transition: opacity 1s ease-out;

    .form-contents {
      border: none;
      margin: 0;
      padding: 0;
      display: flex;
      height: 100%;
      width: 100%;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  ${(props) => props.showForm && css`
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
  `}
`;

export const FormHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  padding: 0 10px;
  color: ${lightGray.hex()};
  border-bottom: 1px solid ${quinary.hex()};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &>div {
    width: 30px;
  }
`;

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 0px;
  height: calc(100% - 120px);
`;

export const FormToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  height: 56px;
  border-top: 1px solid ${quinary.hex()};
  padding: 10px;

  .buttons {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
  }
`

export const IconButton = styled.button`
  width: ${(props) => props.size || '36'}px;
  height: ${(props) => props.size || '36'}px;
  display: flex;
  margin: ${(props) => props.margin || '5px 0px 5px 5px'};
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 3px;
  font-size: 20px;

  background: ${white.hex()};
  color: ${(props) => props.color || accent.darken(0.2).hex()};
  border: ${(props) => props.noBorders ? 'none' : 'thin solid #dedcf0'};

  & svg path {
    stroke: ${accent.hex()};
  }
  &:hover:enabled, &:focus:enabled {
    color: ${(props) => props.color || white.hex()};
    background: ${(props) => props.color ? white.hex() : accent.hex()};
    & svg path {
      stroke: ${white.hex()};
    }
  }
  ${(props) => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    user-select: none;
    font-weight: normal;
  `}
`;
