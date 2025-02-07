import _ from 'lodash';
import React, { memo } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import logo from '~/assets/logo.svg';
import MenuProfile from '~/components/header/menu-profile';
import ImageAuth from '~/components/image';
import { Aside, Container, Profile, Sidebar } from '~/components/menu/styles';
import { getAvatarDefault } from '~/constants';
import useAuth from '~/view-data/use-auth';
import useLogged from '~/view-data/use-logged';
import UserModals from '~/views/users/modals';

const AllIcons = { ...MdIcons, ...FaIcons, ...RiIcons };

function Menu() {
  const { state: authState, actions: authActions } = useAuth(),
    { state: loggedState, actions: loggedActions } = useLogged(),
    user = _.get(authState, 'user'),
    menu = _.filter(_.get(authState, 'menu'), (r) => !!r.icon),
    avatar = _.get(user, 'avatar', ''),
    HomeIcon = AllIcons['MdHome'],
    windowWidth = window.innerWidth;

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

      <Sidebar>
        <img src={logo} alt='Incanto' />
        <nav>
          <ul>
            <NavLink to={'/home'} exact>
              <li>
                <HomeIcon size={22} title={'Página Inicial'} />
              </li>
            </NavLink>
            {_.map(menu, (act, index) => {
              let Icon = AllIcons[act.icon] || AllIcons['MdList'];
              return (
                <NavLink to={act.path} key={index}>
                  <li>
                    <Icon size={18} title={act.label} />
                  </li>
                </NavLink>
              );
            })}
          </ul>
        </nav>
      </Sidebar>
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

export default memo(Menu);
