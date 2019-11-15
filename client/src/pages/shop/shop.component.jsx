import React, { useEffect, lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchCollectionsStart } from '../../redux/shop/shop.actions';

import Spinner from '../../components/spinner/spinner.component';

import { ShopPageContainer } from './shop.styles';

const CollectionsOverviewContainer = lazy(() =>
  import('../../components/collections-overview/collections-overview.container')
);

const CollectionPageContainer = lazy(() =>
  import('../collection/collection.container')
);

const ShopPage = ({ fetchCollectionsStart, match }) => {
  // [fetchCollectionsStart] plutôt qu'un tableau vide [] évite
  // un warning qui demande une dépendance.
  useEffect(() => {
    fetchCollectionsStart();
  }, [fetchCollectionsStart]);

  return (
    <ShopPageContainer>
      <Suspense fallback={<Spinner />}>
        <Route
          exact
          /*
          match.path retourne l'url relative du composant. Ici /shop
          Si on tape l'url /shop alors on affiche le composant 
          CollectionsOverviewContainer
          */
          path={`${match.path}`}
          component={CollectionsOverviewContainer}
        />
        <Route
          /*
          Si on tape une url /shop avec un paramètre derrière
          comme /hats par exemple soit /shop/hats
          On affiche alors le composant CollectionPageContainer
          :collectionId veut dire que hats sera accessible comme paramètre
          depuis le composant CollectionPageContainer 
          */
          path={`${match.path}/:collectionId`}
          component={CollectionPageContainer}
        />
      </Suspense>
    </ShopPageContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStart: () => dispatch(fetchCollectionsStart())
});

export default connect(
  null,
  mapDispatchToProps
)(ShopPage);
