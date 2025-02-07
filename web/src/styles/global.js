import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  *:focus {
    outline: 0;
  }
  html, body, #root {
   height: 100%;
  }
  body {
    -webkit-font-smoothing: antialiased;
  }
  body, input, button, select {
    font: 14px 'Roboto', sans-serif;
  }
  body ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    height: 5px;
  }
  body ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 0px;
  }
  body ::-webkit-scrollbar-thumb {
    cursor: pointer;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.15);
    -webkit-transition: color 0.2s ease;
    transition: color 0.2s ease;
  }
  body ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.1);
  }
  body ::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 135, 139, 0.7);
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 50000s ease-in-out 0s, color 5000s ease-in-out 0s;
  }
  a {
    text-decoration: none;
  }
  ul {
    list-style: none;
  }
  button {
    cursor: pointer;
  }
  input.error {
    border: 1px solid #f91111 !important;
  }
  select.error {
    border: 1px solid #f91111 !important;
  }
  div.error {
    display:flex;
    color: #f91111 !important;
    align-self: flex-start;
    margin: 0 0 10px;
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  [data-reach-menu] {
    z-index: 1099;
  }
`;
