import React from 'react';

// On importe la fonction shallow() de enzyme
import { shallow } from 'enzyme';

// On importe les éléments dont on a besoin pour faire les tests
import { CartDropdown } from './cart-dropdown.component';
import CartItem from '../cart-item/cart-item.component';

import { toggleCartHidden } from '../../redux/cart/cart.actions';

// On déclare un groupe de tests avec describe()
describe('CartDropdown component', () => {
  let wrapper;
  let mockHistory;
  let mockDispatch;
  const mockCartItems = [{ id: 1 }, { id: 2 }, { id: 3 }];

  beforeEach(() => {
    // On crée un objet mockHistory avec une méthode push
    mockHistory = {
      push: jest.fn()
    };

    // On crée une variable mockDispatch qui est une fonction
    mockDispatch = jest.fn();

    // On crée un objet mockProps pour simuler les vrais props
    // qui sont passées au composant
    const mockProps = {
      cartItems: mockCartItems,
      history: mockHistory,
      dispatch: mockDispatch
    };

    // On fait un rendu superficiel du composant (On ne rend pas les composants enfants) avec les props de test
    // On récupère le rendu dans wrapper
    wrapper = shallow(<CartDropdown {...mockProps} />);
  });

  it('should render CartDropdown component', () => {
    // On attend que le rendu du composant corresponde au Snapshot enregistré.
    // Si on fait une modification volontaire sur le composant on doit mettre à jour le snapshot
    expect(wrapper).toMatchSnapshot();
  });

  it('should call history.push when button is clicked', () => {
    // On cherche dans le wrapper le styled component CartDropdownButton
    // puis on simule un click sur le bouton
    wrapper.find('CartDropdownButton').simulate('click');

    // On s'attend à ce que la méthode push de mockHistory soit appelée
    expect(mockHistory.push).toHaveBeenCalled();

    // On s'attend à ce que la fonction mockDispatch soit appelée
    // avec toggleCartHidden() en argument
    expect(mockDispatch).toHaveBeenCalledWith(toggleCartHidden());
  });

  it('should render an equal number of CartItem components as the cartItems prop', () => {
    // On s'attend à ce que le nombre de Composant CartItem rendus
    // soit égal au nombre d'items dans le mockCartItems (ici 3)
    expect(wrapper.find(CartItem).length).toEqual(mockCartItems.length);
  });

  it('should render EmptyMessageContainer if cartItems is empty', () => {
    const mockProps = {
      cartItems: [],
      history: mockHistory,
      dispatch: mockDispatch
    };

    // On génère un nouveau wrapper à partir de nouvelles mockProps
    const newWrapper = shallow(<CartDropdown {...mockProps} />);

    // On s'attend à ce que le wrapper contienne un styled component
    // nommée EmptyMessageContainer
    expect(newWrapper.exists('EmptyMessageContainer')).toBe(true);
  });
});