
import styled from 'styled-components';
import { accent, white, link } from '~/components/mixins/color';
import background from '~/assets/background.jpg';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  background: ${white.hex()};
`;

export const Version = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  font-size: 12px;
  padding: 10px;
  color: ${white.hex()};
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ImageBackground = styled.div`
  height: calc(100vh);
  width: 100%;
  /*background: url(${background});*/
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background: linear-gradient(135deg, ${accent.hex()}, ${accent.hex()}, ${accent.fade(0.35).string()});
  flex-direction: column;
  position: absolute;
  z-index: 1;
`;

export const Contents = styled.div`
  display: flex;
  opacity: 0.90;
  position: absolute;
  z-index: 2;
  background: ${white.fade(0.5).string()};
  width: 456px;
  height: auto;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    width: 330px;
  }
`;

export const Link = styled.div`
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 14px;
  color: ${link.hex()};
  cursor: pointer;
  width: 100%;
  text-align: left;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: ${white.hex()};
  padding: 20px;

  form {
    text-align: center;
    width: 100%;
  }
  img {
    margin: 20px 0;
  }
  button {
    width: 100%;
    margin: 10px 0 0 0;
    height: 50px;
    font-size: 16px;
  }
`;
