import styled from 'styled-components';
import { accent, white } from '~/components/mixins/color';

export const Container = styled.div`
  height: 100%;
  width: 60px;
  background: ${accent.hex()};
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 0;
  box-shadow: 2px -2px 2px -2px #ccc;
`;

export const Sidebar = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-bottom: 15px;
    height: 48px;
  }

  nav {
    display: flex;
    align-items: center;
    overflow-y: scroll;
    height: calc(100vh - 147px);

    ::-webkit-scrollbar {
      display: none;
    }

    > ul {
      height: 100%;
    }

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${white.string()};
      border-radius: 50%;
      margin-bottom: 2px;
      border: 2px solid ${accent.hex()};

      &.active {
        color: ${accent.hex()};
        background: ${white.hex()};
      }
      &:hover {
        border-color: ${white.hex()};
      }
    }
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 5px;
      cursor: pointer;
    }
  }
  @media (max-width: 1024px) {
    nav {
      height: calc(100vh - 145px);
    }
  }
`;

export const GroupSidebar = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-bottom: 15px;
    height: 48px;
  }
  .title, .title:hover, .title:active {
    background: ${accent.hex()};
    color: ${white.hex()};
    height: 28px;
    font-size: 14px;
    padding-left: 10px !important;
    cursor: default !important;
    user-select: none !important;
    pointer-events: none !important;
  }
  .badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    font-size: 12px
    border-radius: 50%;
    position: absolute;
    background: ${white.hex()};
    color: ${accent.hex()};
    right: -5px;
    bottom: -6px;
  }
  nav {
    display: flex;
    justify-content: center;
    width: 60px;
    height: calc(100vh - 147px);

    ::-webkit-scrollbar {
      display: none;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    li ul {
      transition: display 1s linear 2s;
      position: absolute;
      left: 60px;
      top: 0px;
      gap: 0px;
      z-index: 1500;
      display: none;
      background: ${white.hex()};
      height: auto;
      min-width: 300px;
      border-radius: 0 5px 5px 0;
      border-top: 1px solid ${accent.hex()};
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    li ul li {
      display: flex;
      min-width: 300px;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      padding-left: 20px;
      margin-bottom: 0px;
      color: ${accent.hex()};
      border-radius: 0;
      border-bottom: thin solid #f0f0f0;
    }
    li ul li:last-child {
      border-bottom: none;
    }
    li ul li:hover {
      background: ${accent.lighten(0.45).string()};
      color: ${white.hex()};
    }
    li ul li.active {
      color: ${white.hex()};
      background: ${accent.lighten(0.25).string()};
    }
    ul li:hover .badge {
      border: 1px solid ${white.hex()};
      color: ${white.hex()};
      background: ${accent.hex()};
    }
    ul li.active .badge {
      border: 1px solid ${accent.hex()};
      color: ${accent.hex()};
      background: ${white.hex()};
    }
    ul li {
      position: relative;
      display: flex;
      margin-bottom: 5px;
      align-items: center;
      justify-content: center;
      -webkit-text-decoration: none;
      text-decoration: none;
      cursor: pointer;
      height: 36px;
      width: 60px;
    }
    ul li .menu {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      border: 1px solid ${accent.hex()};
      border-radius: 50%;
      padding: 5px;
      width: 36px;
      height: 36px;
    }
    ul li:hover .menu {
      border-color: ${white.hex()};
    }
    ul li.active .menu {
      color: ${accent.hex()};
      background: ${white.hex()};
    }
    ul li svg {
      font-size: 50px;
    }
    .show-menu {
      display: block !important;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin: 3px;
  padding: 5px;

  @media (min-width: 1025px) {
    display: none;
  }

  img {
    cursor: pointer;
    height: 22px;
    width: 22px;
    border-radius: 3px;
  }
`;

export const Aside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: ${white.hex()};
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      color: ${white.hex()};
      background: ${accent.hex()};
    }
  }
`;

