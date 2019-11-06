// La librarie reselect permet de retourner des valeurs du store
// de redux calculées ou non et de les memoïser
import { createSelector } from 'reselect';

// Input selector qui permet de sélectionner une partie du store
// de redux, ici on sélectionne dans selectCart la partie state.card
// du store
const selectCart = state => state.cart;

// Output selector qui retourne le tableau cartItems depuis
// l'input selector selectCart
export const selectCartItems = createSelector(
  [selectCart],
  cart => cart.cartItems
);

export const selectCartHidden = createSelector(
  [selectCart],
  cart => cart.hidden
);

export const selectCartItemsCount = createSelector(
  // On utilise l'output selector selectCartItems comme base
  // pour calculer le nombre d'items dans le panier
  [selectCartItems],
  // On nomme cartItems le paramètre qui correspond à la valeur retournée
  // par le selector selectCartItems
  cartItems =>
    cartItems.reduce(
      (accumalatedQuantity, cartItem) =>
        accumalatedQuantity + cartItem.quantity,
      0
    )
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  cartItems =>
    cartItems.reduce(
      (accumalatedQuantity, cartItem) =>
        accumalatedQuantity + cartItem.quantity * cartItem.price,
      0
    )
);
