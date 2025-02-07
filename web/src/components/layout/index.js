import styled, { css } from 'styled-components';

export const Row = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(${(props) => props.span || 1}, 1fr);
`;

export const FlexRow = styled.div`
  display: flex;
  gap: ${(props) => (props.gap || props.gap === 0) ? props.gap : '10'}px;
  width: 100%;
  flex-direction: ${(props) => props.direction || 'row'};

  ${(props) => props.hide && css`
    display: none;
    visibility: hidden;
    height: 0;
    width: 0;
    opacity: 0;
  `}
`;

export const FlexItem = styled.div`
  display: flex;
  flex: ${(props) => props.flex || '1'};
`;
