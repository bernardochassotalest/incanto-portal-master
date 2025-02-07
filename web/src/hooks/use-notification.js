import { useEffect } from 'react';
import * as firebase from 'firebase/app';
require('firebase/firestore');

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

firebase.initializeApp(config);

function useNotification(props) {
  const { account, user, entity, onData } = props;

  useEffect(() => {
    let initState = true;
    let partial = firebase
      .firestore()
      .collection('notifications')
      .where('account', '==', `${account}`)
      .where('entity', '==', entity)

    if (user) {
      partial = partial.where('user', '==', `${user}`)
    }

    const unsubscribe = partial
      .onSnapshot(
        (snapshot) => {
          if (initState || snapshot.metadata.fromCache)  {
            initState = false
            return
          }
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              onData(change.doc.data())
            }
          })
        },
        (err) => {
          console.error('Firebase', err)
        }
      );

    return () => unsubscribe();
  }, [ account, user, entity, onData ]);
}

export default useNotification;

/*
  USAGE

  import useNotification from '~/hooks/use-notification';

  ...

  useNotification({
    account: `${authState.user.account.id}`,
    entity: 'profiles',
    onData: (data) => {
      if (data.data) {
        dispatch(ProfileActions.change(data.data))
      }
    }
  });

*/