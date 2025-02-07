import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styled from 'styled-components';
import Card from '~/components/kanban/card';
import { white } from '~/components/mixins/color';

const AllIcons = { ...MdIcons, ...FaIcons };

const Content = styled.div`
    display: ${props => props.visible ? 'grid' : 'none'};
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-auto-columns: minmax(280px, 1fr);
    grid-auto-flow: column;
    grid-gap: 10px;
    align-content: flex-start;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    @media (max-width: 425px) {
      width: 100%;
      max-width: 300px;
      body {
        overflow-x: visible;
      }
    }
  `;

const Board = styled.div`
    flex: 1 0 280px;
    background: ${white.hex()};
    border-radius: 3px;
    box-shadow: 0.7px 1px 1px 0 rgba(134, 134, 134, 0.45);
    padding: 3px;
    height: calc(100vh - 80px);

    @media (max-width: 425px) {
      height: calc(100vh - 135px);
    }

    header {
      display: flex;
      align-self: center;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      padding: 0 10px;

      span {
        color: #444;
      }

      h2 {
        font-weight: 500;
        font-size: 16px;
        color: #222;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 14px;
          color: #666;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }

    ul {
      overflow-y: hidden;
      height: calc(100% - 50px);
    }
  `;

const Kanban = ({ loading, boards, cards, boardField, cardOptions, onCardClick = () => {} }) => {
  return (
    <Content visible={!loading}>
      {_.map(boards, (board, bix) => {
        let Icon = AllIcons[board.icon] || AllIcons['MdList'],
          boardCards = _.filter(cards, { [boardField]: board.id })

        return <Board key={bix}>
          <header>
            <h2>
              {board.label} ({_.size(boardCards)})
            </h2>
            <span>
              <Icon size={20} />
            </span>
          </header>

          <ul>
            <PerfectScrollbar>
            {_.map(boardCards, (card, cix) => (
              <Card
                key={cix}
                value={card}
                options={cardOptions}
                handleClick={onCardClick}
                />
            ))}
            </PerfectScrollbar>
          </ul>
        </Board>
      })}
    </Content>
  )
}

Kanban.propTypes = {
  loading: PropTypes.bool,
  boardField: PropTypes.string,
  boards: PropTypes.array.isRequired
}

Kanban.defaultProps = {
  loading: false,
  boardField: 'board'
}

export default Kanban;






/*
  import Kanban from '~/components/kanban';

  let boards = [
      {
        id: 'backlog',
        label: 'Backlog',
        icon: 'MdList'
      },
      {
        id: 'analisis',
        label: 'Em analise',
        icon: 'MdUser'
      },
      {
        id: 'processing',
        label: 'Em execução',
        icon: 'MdSearch'
      },
      {
        id: 'delivery',
        label: 'Em Entrega',
        icon: 'MdPerson'
      },
      {
        id: 'delivered',
        label: 'Entregue',
        icon: 'MdSend'
      }
    ],
    cardOptions = {
      color: (row) => row.status === 'new' ? `green` : 'red',
      title: 'requester',
      subtitle: 'agent',
      detailLeft: 'status',
      detailRight: (row) => row.createdAt
    }

  let cards = [
      {
        board: 'backlog', // obrigatório no modelo do banco
        id: 'PIT-00001',
        createdAt: new Date(),
        requester: 'João',
        agent: 'Maria',
        status: 'new'
      },
      {
        board: 'backlog', // obrigatório no modelo do banco
        id: 'PIT-00002',
        createdAt: new Date(),
        requester: 'João',
        agent: 'Maria',
        status: 'new'
      },
      {
        board: 'processing', // obrigatório no modelo do banco
        id: 'PIT-00003',
        createdAt: new Date(),
        requester: 'João',
        agent: 'Maria',
        status: 'status2'
      }
    ]

  <Kanban
    loading={false}
    boards={boards}
    cardOptions={cardOptions}
    cards={cards}
    />

*/