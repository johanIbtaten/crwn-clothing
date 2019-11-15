import { all, call } from 'redux-saga/effects';

import { shopSagas } from './shop/shop.sagas';
import { userSagas } from './user/user.sagas';
import { cartSagas } from './cart/cart.sagas';

// Export les fonctions qui doivent être chargées ou exécutées 
// au démarrage de l'application par redux-saga
export default function* rootSaga() {
  // all() effect permet d'activer toutes les fonctions generators
  // en même temps. 
  // call() effect permet d'appeler une fonction
  yield all([call(shopSagas), call(userSagas), call(cartSagas)]);
}
