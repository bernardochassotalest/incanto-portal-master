import styled from 'styled-components';
import { Form } from 'formik';

export const Container = styled.div`
  height: 100%;
  max-height: ${props => props.maxHeight};
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;

  @media (max-width: 425px) {
    max-height: 100%;
  }
`;

export const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 5px;
  width: 100%;
  padding: 10px;

  span {
    margin: 0 0 10px;
  }
`;