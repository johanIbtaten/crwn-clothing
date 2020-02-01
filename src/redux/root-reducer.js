import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
// Import de storage qui va permettre la persistance
// dans le local storage et non dans le session storage
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import cartReducer from './cart/cart.reducer';
import directoryReducer from './directory/directory.reducer';
import shopReducer from './shop/shop.reducer';

const persistConfig = {
  key: 'root',
  storage,
  // Parties du store que l'on souhaite persister
  whitelist: ['cart']
};

// On combine les morceaux de state en leur donnant un nom...
// ... à chacun pour pouvoir y accéder ensuite dans les mapToProps
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  directory: directoryReducer,
  shop: shopReducer
});

export default persistReducer(persistConfig, rootReducer);
