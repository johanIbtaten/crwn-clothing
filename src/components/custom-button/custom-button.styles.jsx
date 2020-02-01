// css permet de créer des blocs de css réutilisable dans les composants
// stylisés soit pour étendre les styles d'un composant soit pour éviter 
// de dupliquer des styles
import styled, { css } from 'styled-components';

const buttonStyles = css`
  background-color: black;
  color: white;

  // On peut comme dans sass imbriquer les sélecteurs
  &:hover {
    background-color: white;
    color: black;
    border: 1px solid black;
  }
`;

// On crée un bloc de style réutilisable
const invertedButtonStyles = css`
  background-color: white;
  color: black;
  border: 1px solid black;

  &:hover {
    background-color: black;
    color: white;
    border: none;
  }
`;

const googleSignInStyles = css`
  background-color: #4285f4;
  color: white;

  &:hover {
    background-color: #357ae8;
    border: none;
  }
`;

// On crée une fonction qui prend les props du composant en paramètre
// et retourne le style correspondant aux props que l'on a passé
const getButtonStyles = props => {
  if (props.isGoogleSignIn) {
    return googleSignInStyles;
  }

  return props.inverted ? invertedButtonStyles : buttonStyles;
};

export const CustomButtonContainer = styled.button`
  min-width: 165px;
  width: auto;
  height: 50px;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0 35px 0 35px;
  font-size: 15px;
  text-transform: uppercase;
  font-family: 'Open Sans Condensed';
  font-weight: bolder;
  cursor: pointer;
  display: flex;
  justify-content: center;
  border: none;

  ${getButtonStyles}
`;
