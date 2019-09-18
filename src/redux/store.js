import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
//import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);
//const store = createStore(reducer, enhancer);



export const store = createStore(
    rootReducer,
    enhancer
);

export const persistor = persistStore(store);

export default { store, persistStore };
