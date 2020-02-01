import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from './components/header/header.component';
import Spinner from './components/spinner/spinner.component';
import ErrorBoundary from './components/error-boundary/error-boundary.component';

import { GlobalStyle } from './global.styles';

// On importe les selectors qui correspondent à des morceaux du store.
// Ici la partie user du store.
import { selectCurrentUser } from './redux/user/user.selectors';
// On importe l'action checkUserSession dont on a besoin pour...
// ...le dispatch.
import { checkUserSession } from './redux/user/user.actions';

// Après avoir importé lazy from react, on peut utiliser
// l'import dynamique partout où il y a des Route pour 
// optimiser le chargement des JS
// React charge le chunk du script relatif au composant 
// seulement au moment où le composant est chargé grâce au Route
// Si on regarde le network des fichiers chargés
const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const ShopPage = lazy(() => import('./pages/shop/shop.component'));
const SignInAndSignUpPage = lazy(() =>
  import('./pages/sign-in-and-sign-up/sign-in-and-sign-up.component')
);
const CheckoutPage = lazy(() => import('./pages/checkout/checkout.component'));

const App = ({ checkUserSession, currentUser }) => {
  // On utilise useEffect avec un tableau de dépendance 
  // en deuxième argument pour que l'effet ne se produire qu'une
  // seule fois au moment où le composant est monté. Comme
  // checkUserSession() ne changera pas, l'effet ne sera pas déclenché
  // d'autres fois.
  useEffect(() => {
  // On dispatche une action qui va vérifier au premier
  // chargement de l'application si un utilisateur est déjà 
  // connecté à l'application via Firebase 
    checkUserSession();
  }, [checkUserSession]);

  return (
    <div>
      <GlobalStyle />
      <Header />
      <Switch>
        <ErrorBoundary>
          {/* 
          Le composant importé dynamiquement devrait être exploité 
          dans un composant Suspense, qui nous permet d’afficher 
          un contenu de repli (ex. un indicateur de chargement) 
          en attendant que ce module soit chargé. Ici un composant
          <Spinner /> mais pourrait aussi être directement du code
          html <div>Chargement...</div>
          */}
          <Suspense fallback={<Spinner />}>
            <Route exact path='/' component={HomePage} />
            { /*
            Route passe automatiquement les objets match, location et history
            au composant qu'il affiche.
            */ }            
            <Route path='/shop' component={ShopPage} />
            <Route exact path='/checkout' component={CheckoutPage} />
            <Route
              exact
              path='/signin'
              /* 
              Permet de choisir ce que l'on veut rendre.
              Si il y a un utilisateur connecté, l'url redirige...
              ...vers la page d'accueil, si currentUser est...
              ...null alors current User est évalué à false...
              ...on redirige alors vers la page d'inscription.
              */              
              render={() =>
                currentUser ? <Redirect to='/' /> : <SignInAndSignUpPage />
              }
            />
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

// Permet de passer une fonction en props au composant...
// ...qui va permettre lors de son appel de dispatcher l'action...
// ...checkUserSession() à tous les reducer pour qu'ils la traite.
const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
