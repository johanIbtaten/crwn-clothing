import React, { Profiler } from 'react';

import Directory from '../../components/directory/directory.component';

// On importe le composant stylisé HomePageContainer
// qui est exporté depuis homepage.styles.jsx
import { HomePageContainer } from './homepage.styles';

const HomePage = () => {
  // Permet de simuler une erreur qui peut être attrapé
  // par le périmètre d'erreur
  /*throw Error;*/
  return (
  <HomePageContainer>
  {/*
  Profiler permet de logger combien de temps met un composant
  à se charger
  */}
  {/*
    <Profiler
    id='Directory'
    onRender={(id, phase, actualDuration) => {
      console.log({
        id,
        phase,
        actualDuration
      });
    }}  
  >
  */}
    <Directory />
  {/*</Profiler>*/}

  </HomePageContainer>
)};

export default HomePage;
