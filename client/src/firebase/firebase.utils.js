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

  // On récupère l'objet snapShot à partir de l'objet reference grâce
  // à sa méthode get() Cette objet contient les données.      
  const snapShot = await userRef.get();

  // Si il n'y a pas de données existantes à l'id 
  // demandé snapShot.exists renvoie false 
  if (!snapShot.exists) {
    // Quand le paramètre userAuth provient d'une inscription
    // par email et password, Firebase renvoie un objet user
    // avec la propriété displayName à null
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      // On utilise l'objet reference pour insérer les datas souhaitées 
      // au niveau de l'id demandé.
      await userRef.set({
        displayName,
        email,
        createdAt,
        // additionalData sert à passer le displayName du
        // formulaire d'inscription pour l'ajouter dans le profil
        // de l'utilisateur en bdd quand il s'inscrit à Firebase avec
        // son email et password
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  // On retourne l'objet reference qui permet d'accéder à  
  // l'objet snapShot qui contient les données.
  return userRef;
};

export const createUserCartDocument = async (userId, cartItemsToAdd) => {
  if (!userId) return;
  const cartRef = firestore.doc(`carts/${userId}`);

  const snapShot = await cartRef.get();

    if (!snapShot.exists) {   
      try {    
        await cartRef.set({
          ...cartItemsToAdd
        });
      } catch (error) {
        console.log('error creating cart', error.message);
      }
    }

    return cartRef; 
}

export const updateUserCartDocument = async (userId, newCartItems) => {
  //if (!newCartItems) return;
  const cartRef = firestore.doc(`carts/${userId}`)

  try {    
    await cartRef.set({
      ...newCartItems
    });
  } catch (error) {
    console.log('error updating cart', error.message);
  }

  return cartRef; 
}

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  // On crée une collection avec le nom collectionKey
  // Firebase nous renvoie une reference
  const collectionRef = firestore.collection(collectionKey);
  // On récupère l'objet batch de Firebase
  const batch = firestore.batch();
  // On boucle sur le tableau d'objets à insérer
  objectsToAdd.forEach(obj => {
    // On crée une nouvelle reference de document
    const newDocRef = collectionRef.doc();
    // On insère l'objet dans le document Firebase
    // Quand on fait plusieurs set on utilise batch de Firebase 
    batch.set(newDocRef, obj);
  });
  // batch.commit() renvoie une promesse qui est résolue avec la valeur null
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

// Transorme les données Back-End de Firebase
// en données pour le Front-End sous forme d'une Hashmap
export const convertCollectionsSnapshotToMap = collections => {
  // On récupère les données depuis collections
  // On retrourne un tableau avec les données reformatées pour le Front-End
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      // Encode les caractères spéciaux pour une URL
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    };
  });

  // {} en second argument de reduce() représente l'état initial 
  // de l'accumulator.
  // collection est l'objet courant lors de l'itération
  return transformedCollection.reduce((accumulator, collection) => {
    // On crée une propriété à partir du titre de la collection
    // On lui assigne comme valeur l'objet collection
    accumulator[collection.title.toLowerCase()] = collection;
    // On retourne l'accumulator pour une autre itération
    // qui va ajouter une autre propriété avec son objet associé
    // Pour retourner au final une Hashmap de nos données
    // qui est plus rapide d'accès qu'un simple tableau indexé
    // (Data Normalization)
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
      // Une fois qu'on récupère notre utilisateur connécté
      // On désabonne l'écouteur onAuthStateChanged
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// On export le googleProvider qui va permettre de générer
// le popup de connexion Google dans user.sagas.js
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
// Permet d'exporter la fonction signInWithGoogle qui permet...
// ...quand elle est appelée sur un click d'ouvrir un popup...
// ...d'authentification avec son compte Google.
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;