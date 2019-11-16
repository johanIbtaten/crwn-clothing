import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import CartActionTypes from '../cart/cart.types';
import { clearCart, fetchUserCartSuccess, fetchUserCartFailure } from './cart.actions';
import { selectCart } from './cart.selectors';
import { selectUser } from '../user/user.selectors';

import { createUserCartDocument, updateUserCartDocument } from '../../firebase/firebase.utils';

export function* clearCartOnSignOut() {
  yield put(clearCart());
}

export function* getSnapshotFromUserCart({ payload: { id : userId} }) {
  // console.log(userId);  
  const cart = yield select(selectCart);
  const cartItemsToAdd = cart.cartItems

  try {
    const cartRef = yield call(
      createUserCartDocument,
      userId,
      cartItemsToAdd
    );
    // console.log(cartRef)    
    const cartSnapshot = yield cartRef.get();
    // console.log(cartSnapshot.id);
    const cartData = cartSnapshot.data()

    // Converti un objet contenant de objets en un array d'objets
    const userCartItems = Object.keys(cartData).map(key => {
      return cartData[key];
    })
    // console.log("userCartItems", userCartItems);
    yield put(fetchUserCartSuccess(userCartItems));

  } catch (error) {
    yield put(fetchUserCartFailure(error.message));
  }
}

export function* updateUserCart() {
    const user = yield select(selectUser)
    // console.log(user) 
    // console.log("currentUser:", user.currentUser)
    if(user.currentUser != null) {
      // console.log("user.currentUser n'est pas null")
      const userId = user.currentUser.id
      const cart = yield select(selectCart)
      const newCartItems = cart.cartItems
      try {
          const cartRef = yield call(
            updateUserCartDocument,
            userId,
            newCartItems
          );
          // console.log(cartRef)
          yield put({type : 'UPDATE_CART'})
      } catch (error) {
        
      }
    } 
    // else 
    // {
    //   console.log('user.currentUser est null')
    // }
  }

export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

export function* onSignInSuccess() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, getSnapshotFromUserCart);
}

export function* onCartChange() {
  yield takeLatest([
    CartActionTypes.ADD_ITEM, 
    CartActionTypes.REMOVE_ITEM, 
    CartActionTypes.CLEAR_ITEM_FROM_CART
  ], updateUserCart);
}

export function* cartSagas() {
  yield all([
    call(onSignOutSuccess),
    call(onSignInSuccess),
    call(onCartChange)
    
  ]);
}

