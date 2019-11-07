import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';
//import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './root-reducer';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

// On prépare les middleWares qui vont intercepter...
// ...les actions dispatchées et les traiter avant de les renvoyer...
// ...vers les reducers ou d'envoyer d'autres actions.
const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware, logger),
);

// On crée le store en lui passant le rootReducer et les middlWares
export const store = createStore(
    rootReducer,
    enhancer
);

sagaMiddleware.run(rootSaga);

// On crée un persistor qui va permettre de stocker une partie
// du store que l'on souhaite dans le local storage du navigateur 
// même si on ferme le navigateur. 
export const persistor = persistStore(store);

export default { store, persistor };



