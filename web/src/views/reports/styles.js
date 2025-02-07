import styled, { css } from 'styled-components';
import { white, secondary, red, gray, lightGray, quinary } from '~/components/mixins/color';

export const Container = styled.div`
  height: 100%;
  max-height: ${(props) => props.maxHeight};
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;

  .report {
    background: ${white.hex()};
    display: flex;
    flex: 1;
    width: calc(100% - 35% - 40px);
  }
  .filter {
    display: flex;
    position: relative;
    flex: 0 0 35%;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    background: #fff;
    margin-left: 10px;
    border-radius: 3px;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 15px;
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
  .value {
    flex: 0 0 200px;
    div {
      justify-content: flex-end;
    }
  }
`;

export const ValueBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.odd ? white.hex() : secondary.hex()};
  border-bottom: 1px solid ${secondary.darken(0.2).string()};
  border-radius: 3px;
  padding: 5px 10px;
  font-weight: ${(props) => (props.isParent || props.isRoot) ? 'bold' : 'normal'};
  color: ${(props) => props.isNegative ? red.hex() : gray.darken(0.2).string()};
  height: 30px;
  width: 100%;
  cursor: default;

  ${(props) =>
    props.clickable &&
    css`
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    `}
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 160px);
  overflow: hidden;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .master {
    display: flex;
    flex: 1;
    width: 100%;
    height: calc(100% - ${(props) => props.openDetail ? '60%' : '0px'});
  }
  .detail {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    background: #fff;
    margin-top: 10px;
    border-radius: 3px;
    opacity: 0;
    height: 0px;
    flex: 0;
    border-top: 1px dotted ${lightGray.hex()};
    transition: opacity 1s ease-out;
  }
  ${(props) => props.openDetail && css`
    .detail {
      opacity: 1;
      flex: 0 0 60%;
      height: 60%;
    }
    @media (max-width: 1024px) {
      .master {
        display: none;
        visibility: hidden;
      }
      .detail {
        flex: 1;
        margin-left: 0px;
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .right {
        flex: 0 0 45%;
      }
    }
  `}
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100%);
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex: 0 0 46px;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  height: 46px;
  padding: 0 10px;
  color: ${lightGray.hex()};
  border-bottom: 1px solid ${quinary.hex()};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const DetailBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 0px;
  height: 100%;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: ${props => (props.visible ? "grid" : "none")};
  visibility: ${props => (props.visible ? "visible" : "hidden")};
  opacity: ${props => (props.visible ? "1" : "0")};
  transition: 0.1s;
  z-index: 3;
`;
