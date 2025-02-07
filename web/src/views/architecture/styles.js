import styled from 'styled-components';
import { accent } from '~/components/mixins/color';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  background: #fff;

  /* Zebrado
  background-image: repeating-linear-gradient(-45deg,
      transparent,
      transparent 5px,
      #f0f0f0  5px,
      #f0f0f0  10px);
  background-image: repeating-linear-gradient(-45deg,
      transparent 0 5px,
      #f0f0f0  5px 10px);
  */

  /* Quadriculado
  */
  background-image: linear-gradient(to bottom, transparent 80%, #f0f0f0 80%),
                    linear-gradient(to right, #f8f8f8 80%, #f0f0f0 80%);
  background-size: 10px 10px, 10px 10px;
`;

export const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 30px;
  padding: 30px;
  width: calc(300px * 3 + 30px * 4);
  height: calc(330px * 2 + 30px * 3);

  .thumbs:nth-child(n + 3) {
    grid-column: span 2;
  }

  .thumbs {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-column: span 3;
    height: 330px;

    &> span {
      font-size: 16px;
      font-weight: bold;
      color: #666;
      height: 30px;
      line-height: 30px;
      margin: 0;
    }
    &> div {
      border: 1px solid silver;
      width: 300px;
      height: 300px;
    }
  }
`;

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: span 3;
  width: 300px;
  margin-top: 30px;
  height: 100%;

  &> span {
    font-size: 16px;
    font-weight: bold;
    color: #666;
    height: 30px;
    line-height: 30px;
    margin: 0;
  }
  &> div {
    border: 1px solid silver;
    width: 300px;
    height: auto;
    background: rgba(255, 255, 255, .5);
  }
`;

export const DocumentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  font-weight: bold;
  font-size: 15px;
  width: 100%;
  color: ${accent.hex()};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
