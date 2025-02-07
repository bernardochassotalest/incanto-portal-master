import styled from 'styled-components';
import { gray } from '~/components/mixins/color';

export const Container = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  padding: 10px;
  min-width: 300px;

  h1 {
    font-size: 100px;
    text-align: center;
    color: ${gray.hex()};
    font-weight: 100;
    margin: 0;
  }

  p {
    color: ${gray.hex()};
    font-size: 18px;
  }
`;
