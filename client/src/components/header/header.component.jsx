import React from 'react';
// connect est un HOC (Higher Order Component) qu permet de donner...
// ...accès au store de redux à ce composant. On l'utilise...
// ...au moment de l'export.
// Un HOC prend en paramètre un composant et retourne ce composant...
// ...avec de nouvelles capacités.
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CartIcon from '../cart-icon/cart-icon.component';
import CartDropdown from '../cart-dropdown/cart-dropdown.component';
import { selectCartHidden } from '../../redux/cart/cart.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { signOutStart } from '../../redux/user/user.actions';

// On importe le crown.svg comme un composant que l'on nomme Logo
import { ReactComponent as Logo } from '../../assets/crown.svg';

// On importe les composants stylisés depuis header.styles.jsx
import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink
} from './header.styles';

export const Header = ({ currentUser, hidden, signOutStart }) => (
  <HeaderContainer>
    <LogoContainer to='/'>
      <Logo className='logo' />
    </LogoContainer>
    <OptionsContainer>
      <OptionLink to='/shop'>SHOP</OptionLink>
      <OptionLink to='/shop'>CONTACT</OptionLink>
      {currentUser ? (
        // as='div' permet transformer le composant OptionLink en div
        // en gardant les styles de OptionLink
        <OptionLink as='div' onClick={signOutStart}>
          SIGN OUT
        </OptionLink>
      ) : (
        <OptionLink to='/signin'>SIGN IN</OptionLink>
      )}
      <CartIcon />
    </OptionsContainer>
    { /*
    Si hidden est true alors on fait disparaitre le composant
    <CartDropdown /> avec null
    Si hidden est false on l'affiche 
    */ }
    {hidden ? null : <CartDropdown />}
  </HeaderContainer>
);

// Permet de récupérer des valeurs du store pour les passer en props...
// ...au composant. Ces valeurs sont indentifiées par un nom de props.
// On utilise des selectors pour la memoïsation des props
// createStructuredSelector permet de passer implicitement le store 
// de redux à chaque selector.
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden
});

const mapDispatchToProps = dispatch => ({
  signOutStart: () => dispatch(signOutStart())
});

// Comme on utilise mapStateToProps et mapDispatchToProps,...
// ...on doit passer ces fonctions en paramètres de connect.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
