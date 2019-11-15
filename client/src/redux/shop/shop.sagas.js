import { takeLatest, call, put, all } from 'redux-saga/effects';

import {
  firestore,
  convertCollectionsSnapshotToMap
} from '../../firebase/firebase.utils';

import {
  fetchCollectionsSuccess,
  fetchCollectionsFailure
} from './shop.actions';

import ShopActionTypes from './shop.types';

export function* fetchCollectionsAsync() {
  try {
    const collectionRef = firestore.collection('collections');
    // La structure avec yield est similaire à await dans une
    // fonction async, on attend le résultat de l'appel asynchrone
    const snapshot = yield collectionRef.get();
    // call() effect permet d'appeler une fonction en premier
    // argument et de lui passer des paramètres grâce aux arguments
    // suivants. Cela permet de mettre un yield qui permettra
    // de mieux contrôler et tester l'exécution de la fonction
    const collectionsMap = yield call(
      convertCollectionsSnapshotToMap,
      snapshot
    );
    // put() effect permet de dispatch une action en lui passant
    // un argument
    yield put(fetchCollectionsSuccess(collectionsMap));
  } catch (error) {
    yield put(fetchCollectionsFailure(error.message));
  }
}

// La fonction generator fetchCollectionsStart() reçoit
// l'action FETCH_COLLECTIONS_START et appelle la fonction
// generator fetchCollectionsAsync()
export function* fetchCollectionsStart() {
  yield takeLatest(
    ShopActionTypes.FETCH_COLLECTIONS_START,
    fetchCollectionsAsync
  );
}

export function* shopSagas() {
  yield all([call(fetchCollectionsStart)]);
}
