import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as serviceWorker from './serviceWorker';

import { store, persistor } from './redux/store';

import './index.css';
import App from './App';

ReactDOM.render(
  // On passe le store de redux au Provider qui le mettra...
  // ...à disposition de ses composants enfants
  <Provider store={store}>
    <BrowserRouter>
      { /*
      On entoure notre application avec le PersistGate pour qu'elle
      puisse accéder à la persistance.
      */ }  
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
