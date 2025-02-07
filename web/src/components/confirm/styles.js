import styled from 'styled-components';
import { darken } from 'polished';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: grid;
  visibility: ${props => (props.isOpen ? "visible" : "hidden")};
  opacity: ${props => (props.isOpen ? "1" : "0")};
  transition: 0.1s;
  z-index: 4;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.8);
  font-size: 18px;
  font-weight: 500;
  padding-left: 10px;
  height: ${props => (props.children ? "40px" : "0px")};
  visibility: ${props => (props.children ? "visible" : "hidden")};
`;

const Container = styled.div`
  box-sizing: border-box;
  align-self: center;
  justify-self: center;
  background: ${props => props.background || "#fff"};
  height: ${props => (props.height ? props.height : "20vh")};
  width: ${props => (props.width ? props.width : "50vw")};
  min-height: 150px;
  min-width: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 0.2em;
  transition: 0.3s;
  box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
  margin: calc(0.5em + 2vw);
`;

const Content = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  overflow: auto;
  padding: 10px;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-right: 10px;
  height: ${props => (props.children ? "50px" : "0px")};
  visibility: ${props => (props.children ? "visible" : "hidden")};
  width: 100%;
  position: absolute;
  bottom: 0;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 0px 5px 5px;
    padding: 0px 10px;
    height: 30px;
    font-weight: bold;
    border: 0;
    border-radius: 2px;
    font-size: 13px;
    transition: background 0.2s;

    &:disabled {
      background: ${darken(0.01, "#ccc")};
      color: #777;
    }
  }
`;

export { Background, Container, Title, Content, Footer };
