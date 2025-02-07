import _ from 'lodash';
import { darken } from 'polished';
import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
    background: #f7f8f9;
    border-radius: 3px;
    margin: 8px;
    padding: 7px;
    border-left: 3px solid ${props => props.color};
    box-shadow: 0 1px 4px 0 rgba(138, 138, 138, 0.4);
    display: flex;
    width: calc(100% - 15px);
    align-items: center;
    justify-items: center;

    &:hover {
      background: ${darken(0.03, "#f8f8fa")};
      cursor: pointer;
    }
  `;

export const Info = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;

    strong {
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 14px;
      max-width: 200px;
      text-transform: lowercase;

      &::first-line {
        text-transform: capitalize;
      }
    }

    p {
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 14px;
      color: #333;
      max-width: 200px;
      text-transform: lowercase;

      &::first-line {
        text-transform: capitalize;
      }
    }

    div {
      display: flex;
      justify-content: space-between;
      width: calc(100%);

      span {
        font-size: 11px;
        color: #555;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 14px;
        max-width: calc(50% - 10px);
      }
    }

    @media (max-width: 425px) {
      strong {
        max-width: 150px;
      }
      p {
        max-width: 150px;
      }
      span {
        max-width: 150px;
      }
    }
    `;

const getOptVal = (options, value) => (field) => {
  let opt = _.get(options, field),
    val = _.get(value, opt)

  if (_.isFunction(opt)) {
    val = opt(value)
  }
  return val
}

const Card = ({ options, value, handleClick }) => {
  let acessor = getOptVal(options, value)

  return (
    <Container
      color={acessor('color')}
      onClick={(e) => handleClick(value)}>
      <Info>
        <div>
          <strong>{acessor('title')}</strong>
          <span>{acessor('subtitle')}</span>
        </div>
        <p>{acessor('detail')}</p>
        <p>{acessor('info')}</p>
      </Info>
    </Container>
  )
}

export default Card;
