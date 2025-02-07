import styled, { css } from 'styled-components';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { white, lightGray, symbol } from '~/components/mixins/color';
import { IconButton } from '~/components/crud/styles';

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 28px;
  width: 28px;
  margin: 0 !important;
`;

export const fullscreen = css`
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
`;

export const controlsCss = css`
  position: absolute;
  color: ${symbol.hex()};
  cursor: pointer;
  z-index: 2;
  padding: 0.1em;
  transition: 0.3s;
  width: 1.6em;
  :hover {
    transform: scale(1.07);
  }
`;

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: grid;
  visibility: ${props => (props.isOpen ? "visible" : "hidden")};
  opacity: ${props => (props.isOpen ? "1" : "0")};
  transition: 0.1s;
  z-index: 3;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  color: ${lightGray.hex()}
  font-size: 20px;
  font-weight: 500;
  padding-left: 10px;
  height: ${props => (props.children ? "50px" : "0px")};
  visibility: ${props => (props.children ? "visible" : "hidden")};
`;

export const Container = styled.div`
  box-sizing: border-box;
  align-self: center;
  justify-self: center;
  background: ${props => props.background || white.hex()};
  width: ${props => (props.width ? props.width : "80vw")};
  height: ${props => (props.height ? props.height : "80vh")};
  position: relative;
  overflow: hidden;
  border-radius: 0.2em;
  transition: 0.3s;
  box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
  margin: calc(0.5em + 2vw);
  ${props => props.fullscreen && fullscreen}

  @media (max-width: 1024px) {
    width: ${
      props => {
        if (props.fullscreen) return "100vw"
        return (props.width <= 768 ? props.width : "90vw")
      }
    };
  }

  @media (max-width: 425px) {
    width: ${
      props => {
        if (props.fullscreen) return "100vw"
        return (props.width <= 425 ? props.width : "90vw")
      }
    };
  }
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  overflow-y: auto;
  padding: ${(props) => props.noPadding ? '0' : '10px'};
  background: ${(props) => props.background || white.hex()};
  height: calc(100% - ${(props) => (props.hasFooter && props.hasHeader) ? '100px' : ((!props.hasFooter && !props.hasHeader) ? '0px' : '50px')});
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: ${props => props.background || white.hex()};
  padding-right: 10px;
  height: ${props => (props.children ? "60px" : "0px")};
  visibility: ${props => (props.children ? "visible" : "hidden")};
  width: 100%;
  position: absolute;
  bottom: 0;
`;

export const FullscreenToggle = styled(MdFullscreen).attrs(props => ({
  as: props.fullscreen === "true" && MdFullscreenExit
}))`
  ${controlsCss};
  border-radius: 0.4em;
  top: 0.7em;
  right: 2em;
  width: 20px;
  height: 20px;
`;
