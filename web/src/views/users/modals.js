import React from 'react';
import AvatarForm from '~/views/users/update-avatar';
import UpdatePassword from '~/views/users/update-password';
import UpdateBasic from '~/views/users/update-basic';

function ProfileModals({
  profileData,
  avatarData,
  passwordFrmIsOpen,
  closeModalPassword,
  handleUpdatePassword,
  basicFrmIsOpen,
  handleUpdateBasic,
  closeModalBasic,
  avatarFrmIsOpen,
  closeModalAvatar,
  handleUpdateAvatar,
}) {
  return (
    <>
      {avatarFrmIsOpen && 
        <AvatarForm
          title={<>Mude a sua foto</>}
          data={{ avatar: avatarData }}
          handleOnSubmit={handleUpdateAvatar}
          isOpen={avatarFrmIsOpen}
          closeModal={closeModalAvatar}
          />
      }
      {passwordFrmIsOpen && 
        <UpdatePassword
          title={<>Modifique sua senha</>}
          data={profileData}
          handleOnSubmit={handleUpdatePassword}
          isOpen={passwordFrmIsOpen}
          closeModal={closeModalPassword}
          />
      }
      {basicFrmIsOpen && 
        <UpdateBasic
          title={<>Modifique seus dados</>}
          data={profileData}
          handleOnSubmit={handleUpdateBasic}
          isOpen={basicFrmIsOpen}
          closeModal={closeModalBasic}
          />
      }
    </>
  );
}

export default ProfileModals;
