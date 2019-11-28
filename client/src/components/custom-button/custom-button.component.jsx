import React from 'react';

import { CustomButtonContainer } from './custom-button.styles';

// La props children fait référence au contenu entouré par ce composant
export const CustomButton = ({ children, ...props }) => (
  <CustomButtonContainer {...props}>{children}</CustomButtonContainer>
);

export default CustomButton;
