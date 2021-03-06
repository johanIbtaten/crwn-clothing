import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { signUpStart } from '../../redux/user/user.actions';

import { SignUpContainer, SignUpTitle, ButtonsResponsive } from './sign-up.styles';

const SignUp = ({ signUpStart }) => {
  const [userCredentials, setUserCredentials] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // On récupère les valeurs du state local userCredentials.
  const { displayName, email, password, confirmPassword } = userCredentials;

  const handleSubmit = async event => {
    // Annule l'action implicite correspondante à l'évènement onSubmit
    // qui est normalement de soumettre le formulaire et d'envoyer
    // les données à une autre url ou de recharger la page.
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords don't match");
      // Si les deux champs ne match pas on ne soumet pas le formulaire.
      return;
    }

    // On dispatch une action en lui passant un objet qui représente
    // les userCredentials pour le mettre dans son payload
    signUpStart({ displayName, email, password });
  };
  
  const handleChange = event => {
    // Récupère les valeurs name, value de l'élément qui a déclenché 
    // l'event onChange
    const { name, value } = event.target;

    // On met à jour le state local userCredentials 
    // avec les valeurs du formulaire.  
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <SignUpContainer>
      <SignUpTitle>Je n'ai pas de compte</SignUpTitle>
      <span>Inscrivez-vous avec un email et un mot de passe</span>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          label='Nom'
          required
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          label='Email'
          required
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='Mot de passe'
          required
        />
        <FormInput
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          label='Confirmation du mot de passe'
          required
        />
        <ButtonsResponsive>
          <CustomButton type='submit'>Inscription</CustomButton>
        </ButtonsResponsive>
      </form>
    </SignUpContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  signUpStart: userCredentials => dispatch(signUpStart(userCredentials))
});

export default connect(
  null,
  mapDispatchToProps
)(SignUp);
