import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { gray, primary, white, accent, quinary } from '~/components/mixins/color';

const TabBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 0 40px;
  margin-bottom: 10px;
  border-bottom: thin solid ${primary.hex()};
`;

const TabNav = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  padding: 0 20px;
  font-size: 14px;
  border-top: thin solid ${primary.hex()};
  border-right: thin solid ${primary.hex()};
  height: 42px;

  background: ${white.hex()};
  color: ${gray.hex()};

  &.active {
    background: ${accent.hex()};
    color: ${white.hex()};
  }
  &:first-child {
    border-top-left-radius: 3px;
    border-left: thin solid ${primary.hex()};
  }
  &:last-child {
    border-top-right-radius: 3px;
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  margin: 5px 0px 5px 5px;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 3px;
  font-size: 20px;

  background: ${white.hex()};
  border: 1px solid ${primary.fade(0.8).string()}; // dedcf0
  color: ${primary.hex()};

  & svg path {
    stroke: ${primary.hex()};
  }

  &:hover:enabled,
  &:focus:enabled {
    color: ${white.hex()};
    background: ${primary.hex()};
    & svg path {
      stroke: #fff;
    }
  }
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.2;
      cursor: not-allowed;
      user-select: none;
      font-weight: normal;
    `}
`;

const Show = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 0 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  height: ${(props) => props.height || '100%'};

  ::-webkit-scrollbar {
    display: none;
  }
`;

const TabActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid ${quinary.hex()};
  flex: 0 0 56px;
  margin-top: 10px;
  padding: 10px;
`;

function Tabs({ tabs, initialTab, height, disabled, actions, ...rest }) {
  const [tab, setTab] = useState(initialTab);

  function isActive({ id }) {
    return tab === id;
  }

  return (
    <>
      <TabBar>
        {_.map(tabs, (tab, index) => (
          <TabNav
            key={index}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`${isActive(tab) ? 'active' : ''}`}
          >
            {tab.label}
          </TabNav>
        ))}
      </TabBar>

      <TabContainer height={height}>
        {_.map(tabs, (tabIterate, index) => (
          <Show show={tabIterate.id === tab} key={index}>
            <tabIterate.component disabled={disabled} {...rest} />
          </Show>
        ))}
      </TabContainer>
      {!_.isEmpty(actions) &&
        <TabActions>
          {_.map(actions, (row, index) => (
            <IconButton
              key={index}
              type={row.isSubmit ? 'submit' : 'button'}
              title={row.label}
              disabled={row.disabled}
              onClick={row.action || _.noop}
            >
              <row.icon />
            </IconButton>
          ))}
        </TabActions>
      }
    </>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
    })
  ).isRequired,
  actions: PropTypes.array.isRequired,
  initialTab: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

Tabs.defaultProps = {
  disabled: true,
  actions: [],
};

export default Tabs;
