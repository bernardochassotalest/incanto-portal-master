import React, { memo, useState } from 'react';
import _ from 'lodash';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import logo from '~/assets/logo.svg';
import MenuProfile from '~/components/header/menu-profile';
import ImageAuth from '~/components/image';
import { Aside, Container, Profile, GroupSidebar } from '~/components/menu/styles';
import { getAvatarDefault } from '~/constants';
import useAuth from '~/view-data/use-auth';
import useLogged from '~/view-data/use-logged';
import UserModals from '~/views/users/modals';

const AllIcons = { ...MdIcons, ...FaIcons, ...RiIcons };

function MenuWithGroup(props) {
  const { state: authState, actions: authActions } = useAuth(),
    { state: loggedState, actions: loggedActions } = useLogged(),
    history = useHistory(),
    [currentMenu, setCurrentMenu] = useState(''),
    currentPath = _.get(history, 'location.pathname'),
    user = _.get(authState, 'user'),
    menus = _.filter(_.get(authState, 'menu'), (r) => !!r.icon),
    avatar = _.get(user, 'avatar', ''),
    HomeIcon = AllIcons['MdHome'],
    windowWidth = window.innerWidth;

  let menuMap = {};

  _.each(menus, (m) => {
    let key = m.group || m.id,
      menu = menuMap[key];

    if (!menu) {
      menu = { children: (m.group ? [m] : []), ...(m.group ? { id: m.group, label: m.group, icon: m.groupIcon } : m) };
    } else {
      menu.children.push(m);
    }
    menuMap[key] = menu;

  });
  let menuTree = _.values(menuMap);

  async function goTo(path) {
    setCurrentMenu('');
    if (path) {
      history.push(path);
    }
  };

  function activeClass(path, children = []) {
    let childIsActive = _.find(children, (r) => currentPath === r.path);
    return ((path && currentPath && currentPath === path) || (!_.isEmpty(children) && childIsActive)) ? 'active' : '';
  };

  function handleUpdatePassword(data, actions) {
    actions.closeModal = () => loggedActions.passwordFrm(false);
    loggedActions.updatePassword(data, actions);
  };

  function handleUpdateBasic(data, actions) {
    actions.closeModal = () => loggedActions.basicFrm(false);
    loggedActions.updateBasic(data, actions);
  };

  function handleUpdateAvatar(data, actions) {
    const { avatar } = data;
    actions.closeModal = () => loggedActions.avatarFrm(false);
    loggedActions.updateAvatar(avatar, actions);
  };

  function handleMenuAction(action) {
    if (action === 'avatar') {
      loggedActions.avatarFrm(true);
    } else if (action === 'pwd') {
      loggedActions.passwordFrm(true);
    } else if (action === 'basic') {
      loggedActions.basicFrm(true);
    }
  };

  return (
    <Container>
      <GroupSidebar>
        <img src={logo} alt='Incanto' />
        <nav>
          <ul>
            <li className={activeClass('/home')} onClick={() => goTo('/home')}>
              <span>
                <HomeIcon size={22} title={'Página Inicial'} />
              </span>
            </li>
            {_.map(menuTree, (menu, index) => {
              let Icon = AllIcons[menu.icon] || AllIcons['MdList'];
              return (
                <li
                  key={index}
                  className={activeClass(menu.path, menu.children)}
                  onClick={() => { setCurrentMenu(menu.id); goTo(menu.path) }}
                  onMouseEnter={() => setCurrentMenu(menu.id)}
                  onMouseLeave={() => setCurrentMenu('')}
                  >
                  <div className="menu">
                    <Icon size={18} title={menu.label} />
                    {!_.isEmpty(menu.children) &&
                      <div className="badge">{_.size(menu.children)}</div>
                    }
                  </div>

                  {!_.isEmpty(menu.children) &&
                    <ul className={currentMenu === menu.id ? 'show-menu' : ''}>
                      <li className="title">
                        {menu.label}
                      </li>
                      {_.map(menu.children, (sub, s) => {
                        return (
                          <li
                            key={s}
                            className={activeClass(sub.path)}
                            onClick={() => goTo(sub.path)}>
                            {sub.label}
                          </li>
                        )
                      })}
                    </ul>
                  }
                </li>
              );
            })}
          </ul>
        </nav>
      </GroupSidebar>
      <Aside>
        {windowWidth < 1025 &&
          <Profile>
            <UserModals
              profileData={user}
              avatarData={avatar}
              passwordFrmIsOpen={loggedState.pwdFrmIsOpen}
              closeModalPassword={() => loggedActions.passwordFrm(false)}
              handleUpdatePassword={handleUpdatePassword}
              basicFrmIsOpen={loggedState.basicFrmIsOpen}
              handleUpdateBasic={handleUpdateBasic}
              closeModalBasic={() => loggedActions.basicFrm(false)}
              avatarFrmIsOpen={loggedState.avatarFrmIsOpen}
              closeModalAvatar={() => loggedActions.avatarFrm(false)}
              handleUpdateAvatar={handleUpdateAvatar}
              />
            <MenuProfile onAction={handleMenuAction}>
              <ImageAuth src={avatar} defaultImage={getAvatarDefault()} />
            </MenuProfile>
          </Profile>
        }
        <ul>
          <li onClick={authActions.logout}>
            <AllIcons.MdExitToApp size={24} />
          </li>
        </ul>
      </Aside>
    </Container>
  );
}

export default memo(MenuWithGroup);
