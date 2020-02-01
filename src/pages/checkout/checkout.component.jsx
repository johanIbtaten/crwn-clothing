import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StripeCheckoutButton from '../../components/stripe-button/stripe-button.component';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';

import {
  selectCartItems,
  selectCartTotal
} from '../../redux/cart/cart.selectors';

import {
  CheckoutPageContainer,
  CheckoutHeaderContainer,
  HeaderBlockContainer,
  TotalContainer,
  WarningContainer,
  EmptyMessage
} from './checkout.styles';

export const CheckoutPage = ({ cartItems, total }) => (
  <CheckoutPageContainer>
    <CheckoutHeaderContainer>
      <HeaderBlockContainer>
        <span>Product</span>
      </HeaderBlockContainer>
      <HeaderBlockContainer>
        <span>Description</span>
      </HeaderBlockContainer>
      <HeaderBlockContainer>
        <span>Quantity</span>
      </HeaderBlockContainer>
      <HeaderBlockContainer>
        <span>Price</span>
      </HeaderBlockContainer>
      <HeaderBlockContainer>
        <span>Remove</span>
      </HeaderBlockContainer>
    </CheckoutHeaderContainer>
      { /* 
      Si cartItems.length est égal 0 l'expression est évaluée à false
      et on affiche "Votre panier est vide"
      Sinon à true et on affiche les items du panier
      */ }
      {cartItems.length ? (
        cartItems.map(cartItem => (
          <CheckoutItem key={cartItem.id} cartItem={cartItem} />
        ))
      ) : (
        <EmptyMessage>Votre panier est vide</EmptyMessage>
      )}
    
    <TotalContainer>TOTAL: {total+'€'}</TotalContainer>
    <WarningContainer>
      *Merci d'utiliser ce numéro de carte de crédit de test pour effectuer les paiements
      <br />
      4242&nbsp;4242&nbsp;4242&nbsp;4242 - Exp:&nbsp;01/20 - CVV:&nbsp;123
    </WarningContainer>
    <StripeCheckoutButton price={total} />
  </CheckoutPageContainer>
);

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartTotal
});

export default connect(mapStateToProps)(CheckoutPage);
