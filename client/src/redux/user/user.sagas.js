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
    const userSnapshot = yield userRef.get();
    // On dispatch l'action signInSuccess en lui passant sous 
    // forme d'un objet les données de l'utilisateur (stockées
    // dans un document de la collection users dans Firebase)
    // à partir du userSnapshot pour que l'action le place 
    // dans son payload et ainsi pour pouvoir les utiliser 
    // dans l'application si besoin. On récupère l'id gâce à userSnapshot.id
    // et l'objet contenant les données grâce à la méthode userSnapshot.data()   
    yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield auth.signInWithPopup(googleProvider);
    yield getSnapshotFromUserAuth(user);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromUserAuth(user);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

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
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

// Intercepte l'action CHECK_USER_SESSION qui a été dispatchée...
// ...pour appeler la fonction isUserAuthenticated qui va traiter...
// ...l'appel asynchrone.
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
