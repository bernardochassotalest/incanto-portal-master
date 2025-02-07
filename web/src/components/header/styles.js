import styled from 'styled-components';
import { gray, secondary, lightGray } from '~/components/mixins/color';

export const Container = styled.div`
  width: 100%;
`;

export const Content = styled.div`
  height: 60px;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;

  .title {
    width: 100%;
    display: inline;
    color: ${gray.hex()};
    font-weight: 400;
    font-size: 19px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size-adjust: 0.58;
  }

  @media (max-width: 1024px) {
    .title {
      min-width: 70%;
      display: inline;
      color: ${gray.hex()};
      font-weight: 400;
      font-size: 19px;
      text-overflow: ellipsis;
      font-size-adjust: 0.58;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  padding-left: 15px;
  border-left: 1px solid ${secondary.hex()};

  @media (max-width: 1024px) {
    display: none;
  }

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: ${gray.hex()};
      font-weight: 500;
      max-width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span {
      display: block;
      margin-top: 1px;
      font-size: 12px;
      color: ${lightGray.hex()};
      max-width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: lowercase;

      &::first-line {
        text-transform: capitalize;
      }
    }
  }

  img {
    height: 35px;
    width: 35px;
    object-fit: cover;
    border-radius: 10px;
    transition: background 0.5s;

    &:hover {
      opacity: 0.6;
    }
  }
`;
