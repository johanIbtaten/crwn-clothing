import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { selectIsCollectionFetching } from '../../redux/shop/shop.selectors';
import WithSpinner from '../with-spinner/with-spinner.component';
import CollectionsOverview from './collections-overview.component';

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsCollectionFetching
});

// CollectionsOverviewContainer implémente le pattern 
// Container qui permet d'éviter au composant de plus au niveau
// de passer des mapStateToProps qui ne le concernent 
// pas directement. Comme ça les mapStateToProps
// restent liées au composant qui les utilise pour plus
// de cohérence et de clarté. 
// On utilise compose() de redux pour éviter d'écrire trop 
// d'imbrications peu lisibles des HOC
const CollectionsOverviewContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(CollectionsOverview);

export default CollectionsOverviewContainer;
