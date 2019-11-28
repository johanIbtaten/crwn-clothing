import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CollectionPreview from '../collection-preview/collection-preview.component';

import { selectCollectionsForPreview } from '../../redux/shop/shop.selectors';
import { CollectionsOverviewContainer } from './collections-overview.styles';

export const CollectionsOverview = ({ collections }) => (
  <CollectionsOverviewContainer>
    { /*
    On peut destructurer directement les propriétés d'un objet passé 
    en argument pour les utiliser comme paramètres. 
    Ici les propriétés d'un item de collections comporte les
    propriétés : id, routeName, title, items
    On spread routeName, title, items avec ...otherCollectionProps
    pour les passer en props au composant CollectionPreview
    */ } 
    {collections.map(({ id, ...otherCollectionProps }) => (
      <CollectionPreview key={id} {...otherCollectionProps} />
    ))}
  </CollectionsOverviewContainer>
);

const mapStateToProps = createStructuredSelector({
  collections: selectCollectionsForPreview
});

export default connect(mapStateToProps)(CollectionsOverview);
