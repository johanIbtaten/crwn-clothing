import React from 'react';

import Directory from '../../components/directory/directory.component';

// On importe le composant stylisé HomePageContainer
// qui est exporter depuis homepage.styles.jsx
import { HomePageContainer } from './homepage.styles';

const HomePage = () => (
  <HomePageContainer>
    <Directory />
  </HomePageContainer>
);

export default HomePage;
