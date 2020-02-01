import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../cart/cart.types';
import { getUserCartRef } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../user/user.selectors';
import { clearCart, setCartFromFirebase } from './cart.actions';
import { selectCartItems } from './cart.selectors';

export function* clearCartOnSignOut() {
  yield put(clearCart());
}

export function* updateCartInFirebase() {
  // On récupère l'utilisateur connecté à partir du store 
  // de redux et de l'effet select() de redux-saga 
  // grâce au selector selectCurrentUser du fichier cart.selector.js
  const currentUser = yield select(selectCurrentUser);
  // Si l'utilisateur est connecté.
  if (currentUser) {
    try {
      // On récupère la référence du document cart associée 
      // à l'utilisateur connecté.
      const cartRef = yield getUserCartRef(currentUser.id);
      // On récupère le tableau des items du cart à partir du store 
      // de redux et de l'effet select() de redux-saga 
      const cartItems = yield select(selectCartItems);
      // On met à jour le tableau des items du document cart
      // de l'utilisateur
      yield cartRef.update({ cartItems });
    // Si il y a une erreur, on l'affiche.
    } catch (error) {
      console.log(error);
    }
  }
}

// On récupère le user du payload de l'action SIGN_IN_SUCCESS
export function* checkCartFromFirebase({ payload: user }) {
  // On récupère le tableau des items du cart à partir du store 
  // de redux et de l'effet select() de redux-saga 
  // grâce au selector selectCartItems du fichier cart.selector.js
  const cartItems = yield select(selectCartItems);
  // On récupère la référence du document cart associée 
  // à l'utilisateur connecté. On le crée si il n'existe pas encore. 
  const cartRef = yield getUserCartRef(user.id, cartItems);
  // Si le panier n'est pas vide au moment où il se connecte
  // On met à jour le tableau des items du document cart
  // de l'utilisateur
  if (cartItems.length > 0) yield cartRef.update({ cartItems });
  // On récupère le snapshot du document cart à partir de sa
  // référence
  const cartSnapshot = yield cartRef.get();
  // On met à jour le cart du store de redux avec le cart de Firebase
  // en dispatchant une action vers le cart reducer
  yield put(setCartFromFirebase(cartSnapshot.data().cartItems));
}

export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

export function* onUserSignIn() {
  // Quand on intercepte l'action SIGN_IN_SUCCESS on exécute la fonction checkCartFromFirebase()
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, checkCartFromFirebase);
}

export function* onCartChange() {
  // Quand on intercepte les actions ADD_ITEM, REMOVE_ITEM,
  // CLEAR_ITEM_FROM_CARTMon exécute la fonction updateCartInFirebase()
  yield takeLatest(
    [
      CartActionTypes.ADD_ITEM,
      CartActionTypes.REMOVE_ITEM,
      CartActionTypes.CLEAR_ITEM_FROM_CART
    ],
    updateCartInFirebase
  );
}

export function* cartSagas() {
  yield all([call(onSignOutSuccess), call(onCartChange), call(onUserSignIn)]);
}

