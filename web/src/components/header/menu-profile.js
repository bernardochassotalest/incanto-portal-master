import React, { memo } from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import styled from 'styled-components';
import { white, gray, accent, primary } from '~/components/mixins/color';
import './dropdown.css';

const ProfileMenuList = styled(MenuList)`
  padding: 0;
  margin-bottom: 5px;

  > [data-reach-menu-item][data-selected] {
    color: ${white.hex()};
    background: ${accent.hex()};
  }
  > [data-reach-menu-list], [data-reach-menu-items] {
    background: ${primary.hex()};
    color: ${gray.hex()};
    border: 1px solid #f0f0f0;
  }
`;

const MenuProfile = ({ children, onAction }) => {
  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <ProfileMenuList>
        <MenuItem onSelect={() => onAction('avatar')}>Alterar Foto</MenuItem>
        <MenuItem onSelect={() => onAction('basic')}>Alterar Dados</MenuItem>
        <MenuItem onSelect={() => onAction('pwd')}>Alterar senha</MenuItem>
      </ProfileMenuList>
    </Menu>
  );
};

export default memo(MenuProfile)
