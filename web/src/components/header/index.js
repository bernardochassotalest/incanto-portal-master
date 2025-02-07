import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImageAuth from '~/components/image';
import { getAvatarDefault } from '~/constants';
import useAuth from '~/view-data/use-auth';
import useLogged from '~/view-data/use-logged';
import UserModals from '~/views/users/modals';
import MenuProfile from './menu-profile';
import { Container, Content, Profile, Toolbar } from './styles';

const accountTypeMap = {
  'supplier': 'Fornecedor',
  'press': 'Imprensa',
};

function Header({ children }) {
  const { state: authState } = useAuth(),
    { state: loggedState, actions: loggedActions } = useLogged(),
    user = _.get(authState, 'user'),
    accountType = _.get(user, 'account.accountType', ''),
    accountName = accountTypeMap[accountType] || accountType,
    avatar = _.get(user, 'avatar'),
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
    actions.closeModal = () => loggedActions.avatarFrm(false);
    loggedActions.updateAvatar(data.avatar, actions);
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
      <Content>
        <Toolbar>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, {});
          })}
        </Toolbar>
        {windowWidth > 1025 &&
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
            <div>
              <strong title={_.get(user, 'name')}>{_.get(user, 'name')}</strong>
              <span>{accountName}</span>
            </div>
            <MenuProfile onAction={handleMenuAction}>
              <ImageAuth
                withoutLoading={true}
                src={avatar || ''}
                defaultImage={getAvatarDefault()}
                />
            </MenuProfile>
          </Profile>
        }
      </Content>
    </Container>
  );
}

Header.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Header;
