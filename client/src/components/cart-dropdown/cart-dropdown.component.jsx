import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import CartItem from '../cart-item/cart-item.component';
import { selectCartItems } from '../../redux/cart/cart.selectors';
import { toggleCartHidden } from '../../redux/cart/cart.actions.js';

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
      et on affiche "Your cart is empty"
      Sinon à true et on affiche les items du panier
      */ }
      {cartItems.length ? (
        cartItems.map(cartItem => (
          <CartItem key={cartItem.id} item={cartItem} />
        ))
      ) : (
        <EmptyMessageContainer>Your cart is empty</EmptyMessageContainer>
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
      GO TO CHECKOUT
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
