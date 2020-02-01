import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import CartItem from '../cart-item/cart-item.component';
import { selectCartItems } from '../../redux/cart/cart.selectors';
import { toggleCartHidden } from '../../redux/cart/cart.actions';

import {
  CartDropdownContainer,
  CartDropdownButton,
  EmptyMessageContainer,
  CartItemsContainer
} from './cart-dropdown.styles';

export const CartDropdown = ({ cartItems, history, dispatch }) => (
  <CartDropdownContainer>
    <CartItemsContainer>
      { /* 
      Si cartItems.length est égal 0 l'expression est évaluée à false
      et on affiche "Votre panier est vide" 
      Sinon à true et on affiche les items du panier
      */ }
      {cartItems.length ? (
        cartItems.map(cartItem => (
          <CartItem key={cartItem.id} item={cartItem} />
        ))
      ) : (
        <EmptyMessageContainer>Votre panier est vide</EmptyMessageContainer>
      )}
    </CartItemsContainer>
    <CartDropdownButton
      onClick={() => {
        // Permet une redirection au click vers l'url /checkout
        history.push('/checkout');
        // Dispatch l'action toggleCartHidden()
        dispatch(toggleCartHidden());
      }}
    >
      Voir la commande
    </CartDropdownButton>
  </CartDropdownContainer>
);

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems
});

// withRouter est un HOC (High Order Component) qui permet 
// de doter le composant que l'on lui passe, des fonctions et
// propriétés de react-router-dom comme la redirection d'un lien
// vers une url spécifique par exemple
export default withRouter(connect(mapStateToProps)(CartDropdown));
