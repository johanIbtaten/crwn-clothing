import React from 'react';

import Spinner from '../spinner/spinner.component';

// WithSpinner est un HOC (High Order Component)
// C'est un fonction qui prend en paramètre un composant
// que l'on a nommé WrappedComponent et qui retourne un composant
// Avec ...otherProps on passe les props depuis le HOC au
// composant qu'il entoure.
const WithSpinner = WrappedComponent => ({ isLoading, ...otherProps }) => {
  return isLoading ? <Spinner /> : <WrappedComponent {...otherProps} />;
};

export default WithSpinner;
