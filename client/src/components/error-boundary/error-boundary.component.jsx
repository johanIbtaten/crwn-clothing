import React from 'react';

import {
  ErrorImageOverlay,
  ErrorImageContainer,
  ErrorImageText
} from './error-boundary.styles';

// Les périmètres d’erreurs (ErrorBoundary) sont des composants React qui interceptent 
// les erreurs JavaScript n’importe où au sein de leur arbre de 
// composants enfants, enregistrent ces erreurs, et affichent une 
// UI de repli à la place de l’arbre de composants qui a planté. 
// Les périmètres d’erreurs interceptent les erreurs survenant 
// au rendu, dans les méthodes de cycle de vie, ainsi que dans les 
// constructeurs de tous les éléments de leur arborescence.

// Une classe de composant devient un périmètre d’erreur si elle 
// définit au moins une des méthodes de cycle de vie 
// static getDerivedStateFromError() ou componentDidCatch(). 
// Utilisez static getDerivedStateFromError() pour afficher une UI de 
// repli lorsqu’une erreur est levée. Utilisez componentDidCatch() 
// pour enregistrer les informations relatives à l’erreur.

// Les périmètres d’erreurs n’interceptent pas les erreurs qui surviennent dans :
// Les gestionnaires d’événements.
// Le code asynchrone (par exemple les fonctions de rappel de setTimeout ou requestAnimationFrame).
// Le rendu côté serveur.
// Les erreurs levées dans le composant du périmètre d’erreur lui-même (plutôt qu’au sein de ses enfants).
class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false
    };
  }

  
  static getDerivedStateFromError(error) {
    // Indique si il y a une erreur pour afficher l'UI de repli (La 
    // page d'erreur)
    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  render() {
    // Si il y a une erreur on affiche la page de repli
    if (this.state.hasErrored) {
      return (
        <ErrorImageOverlay>
          <ErrorImageContainer imageUrl='https://i.imgur.com/yW2W9SC.png' />
          <ErrorImageText>Sorry this page is broken</ErrorImageText>
        </ErrorImageOverlay>
      );
    }
    // Sinon on affiche les enfants du composant ErrorBoundary
    return this.props.children;
  }
}

export default ErrorBoundary;
