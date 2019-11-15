import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import {
  googleSignInStart,
  emailSignInStart
} from '../../redux/user/user.actions';

import {
  SignInContainer,
  SignInTitle,
  ButtonsBarContainer
} from './sign-in.styles';

const SignIn = ({ emailSignInStart, googleSignInStart }) => {
  // On déclare un hook de state local avec une objet 
  // en valeur initiale
  const [userCredentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // On destructure l'objet du state local dans des variables uniques
  const { email, password } = userCredentials;

  // On déclare une fonction gestionnaire de soumission du formulaire
  // qui prend en paramètre l'évènement submit
  const handleSubmit = async event => {
    event.preventDefault();

    // On dispatch l'action creator emailSignInStart en lui passant
    // l'email et le password en paramètres qui seront transformés
    // au niveau de mapDispatchToProps en un seul objet pour le payload
    emailSignInStart(email, password);
  };

  // On déclare un gestionnaire de changement qui réagit à la
  // modification du contenu tapé dans l'input du formulaire.
  // Il prend en paramètre l'évènement change
  const handleChange = event => {
    // On récupère le name du champ qui a appelé le gestionnaire
    // et sa value à partir de target qui représente l'élément du
    // DOM qui a déclenché l'évènement.
    const { value, name } = event.target;

    // On met à jour le state local en ajoutant ou modifiant
    // des propriétés du state existant.
    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <SignInContainer>
      <SignInTitle>I already have an account</SignInTitle>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          type='email'
          handleChange={handleChange}
          value={email}
          label='email'
          required
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
          required
        />
        <ButtonsBarContainer>
          <CustomButton type='submit'> Sign in </CustomButton>
          <CustomButton
            /*
            On met un attribut button pour que le bouton
            ne soumette pas le formulaire.
            */
            type='button'
            /*
            On dispatch l'action googleSignInStart qui va
            être utilisée par user-sagas.js
            */
            onClick={googleSignInStart}
            isGoogleSignIn
          >
            Sign in with Google
          </CustomButton>
        </ButtonsBarContainer>
      </form>
    </SignInContainer>
  );
};

// On passe en props nos deux fonction nommées googleSignInStart et
// emailSignInStart qui vont permettre à notre composant de dispatcher
// l'action googleSignInStart sans payload et emailSignInStart avec
// un payload
const mapDispatchToProps = dispatch => ({
  googleSignInStart: () => dispatch(googleSignInStart()),
  // L'email et le password sont tranformés en un objet avec les deux
  // propriétés email et password
  emailSignInStart: (email, password) =>
    dispatch(emailSignInStart({ email, password }))
});

export default connect(
  null,
  mapDispatchToProps
)(SignIn);
