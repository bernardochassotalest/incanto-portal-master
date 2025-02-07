import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .main {
    display: flex;
    flex-direction: column;
    width: calc(100% - 60px);
    height: 100%;
    background: #f0f0f0;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: calc(100% - 60px);
`;

export const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;

  & > div {
    margin-left: 10px;
  }
`;
