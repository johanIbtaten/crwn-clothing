import { takeLatest, put, all, call } from 'redux-saga/effects';

import UserActionTypes from './user.types';

import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure
} from './user.actions';

import {
  auth,
  googleProvider,
  createUserProfileDocument,
  getCurrentUser
} from '../../firebase/firebase.utils';

export function* getSnapshotFromUserAuth(userAuth, additionalData) {
  try {
    const userRef = yield call(
      createUserProfileDocument,
      userAuth,
      additionalData
    );
    // On récupère l'objet snapShot à partir de l'objet reference
    // renvoyé par Firebase
    const userSnapshot = yield userRef.get();
    // put() permet de d'envoyer l'action aux reducers de redux.
    // On appelle l'action creator signInSuccess en lui passant
    // en argument un objet des données de l'utilisateur (stockées
    // dans un document de la collection users dans Firebase)
    // On récupère l'id gâce à userSnapshot.id et l'objet 
    // contenant les données grâce à la méthode userSnapshot.data() 
    yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithGoogle() {
  try {
    // On reçoit un objet de Firebase dont la propriété user
    // correspond à l'objet userAuth que l'on souhaite utiliser
    // pour construire et stocker le profil des utilisateurs
    const { user } = yield auth.signInWithPopup(googleProvider);
    yield getSnapshotFromUserAuth(user);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

// takeLatest qui a appelé cette fonction passe l'action en 
// argument donc on peut récupérer les propriétés de l'action 
// comme les valeurs de son payload
export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromUserAuth(user);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

// Cette fonction est exportée dans le root-saga car elle sera
// exécutée au démarrage de l'application
export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    // Si il n'y a pas d'utilisateur connecté à Firebase
    // on retourne undefined
    if (!userAuth) return;
    // Si l'utilisateur est connecté on appelle la fonction
    // getSnapshotFromUserAuth qui va permettre de récupérer les données
    // de l'utilisateur.
    yield getSnapshotFromUserAuth(userAuth);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signOut() {
  try {
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

// On passe en paramètre par destructuring les données de l'objet 
// payload provenant de l'action SIGN_UP_START
export function* signUp({ payload: { email, password, displayName } }) {
  try {
    // On récupère l'objet user de Firebase après l'incription
    // grâce à l'email et le password.
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    // On dispatch l'action SIGN_UP_SUCCESS qui appelle la fonction
    // signInAfterSignUp    
    yield put(signUpSuccess({ user, additionalData: { displayName } }));
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

// On passe en paramètre par destructuring les données de l'objet 
// payload provenant de l'action SIGN_UP_SUCCESS
export function* signInAfterSignUp({ payload: { user, additionalData } }) {
  // On appelle la fonction getSnapshotFromUserAuth qui va créer
  // un nouvel utilisateur dans users dans la bdd et connecter
  // le nouvel utilisateur  
  yield getSnapshotFromUserAuth(user, additionalData);
}

export function* onGoogleSignInStart() {
  // takeLatest est un listener qui écoute la dernière action
  // dispatchée
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

// Intercepte l'action CHECK_USER_SESSION qui a été dispatchée...
// ...pour appeler la fonction isUserAuthenticated qui va traiter...
// ...l'appel asynchrone.
// On appelle cette fonction un Watcher saga car elle observe
// une action spécifique et appelle un Worker saga
export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

// Export les fonctions qui doivent être chargées ou exécutées 
// au démarrage de l'application par redux-saga et 
// cette fonction est utilisées par le root-saga.js
export function* userSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(isUserAuthenticated),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess)
  ]);
}
