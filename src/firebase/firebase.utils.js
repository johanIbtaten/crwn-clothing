import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyAxOMbCoBviw-kMM6uBwjnsnizIFhJFWws",
  authDomain: "crwn-db-5272d.firebaseapp.com",
  databaseURL: "https://crwn-db-5272d.firebaseio.com",
  projectId: "crwn-db-5272d",
  storageBucket: "",
  messagingSenderId: "734782516342",
  appId: "1:734782516342:web:b2346c1773d5738df8c357"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

// Ajouter ce code dans App.js pour ajouter une collection à Firebase à partir du JSON 

//import { auth, createUserProfileDocument, addCollectionAndDocuments  } from './firebase/firebase.utils';
//import { selectCollectionsForPreview } from './redux/shop/shop.selectors';

// componentDidMount() {
//   const { setCurrentUser, collectionsArray } = this.props;

//   this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
//     [...]
//     setCurrentUser(userAuth);
//     addCollectionAndDocuments('collections', collectionsArray.map(({title, items}) => ({title, items})));
//   });
// }

// const mapStateToProps = createStructuredSelector({
//   currentUser: selectCurrentUser,
//   collectionsArray: selectCollectionsForPreview
// });

export const convertCollectionsSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
