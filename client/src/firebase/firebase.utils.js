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
  // Si userAuth est null on retourne undefined
  if (!userAuth) return;

  // On fait un appel à l'API Firebase qui nous renvoie 
  // toujours un objet reference et ce même si il n'y a rien 
  // à l'emplacement demandé dans la bdd. Ici l'emplacement
  // demandé est users/${userAuth.uid} où users est la collection
  // et userAuth.uid l'id du document demandé.
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  // On récupère l'objet snapshot à partir de l'objet reference grâce
  // à sa méthode get() Cette objet contient les données.      
  const snapShot = await userRef.get();

  // Si il n'y a pas de données existantes à l'id 
  // demandé snapShot.exists renvoie false 
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      // On utilise l'objet reference pour insérer les datas souhaitées 
      // au niveau de l'id demandé.
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

// Permet d'athentifier l'utilisateur courant et de renvoyer...
// ...l'objet Firebase de cet utilisateur.
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    // onAuthStateChanged est un observateur qui synchronise
    // l'application et l'utilisateur courant authentifié sur Firebase.
    // Il renvoie la fonction unsubscribe pour l'obersvateur
    // Il prend en paramètre un callback qui prend en paramètre
    // l'utilisateur userAuth sous forme d'un gros objet.
    // Si aucun utilisateur n'est déconnecté userAuth vaut null
    // qui est évalué à false.
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
// Permet d'exporter la fonction signInWithGoogle qui permet...
// ...quand elle est appelée sur un click d'ouvrir un popup...
// ...d'authentification avec son compte Google.
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;