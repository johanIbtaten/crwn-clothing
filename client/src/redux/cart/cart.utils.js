export const addItemToCart = (cartItems, cartItemToAdd) => {
  // Si l'item du panier que l'on souhaite ajouter existe déjà dans
  // la collection cartItems alors existingCartItem est évalué à true. 
  // Si il n'existe pas existingCartItem vaut undefined évalué à false
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === cartItemToAdd.id
  );

  // Si l'item existe déjà dans le panier, on retourne la collection
  // avec la quantity de l'item augmentée de 1
  if (existingCartItem) {
    return cartItems.map(cartItem =>
      cartItem.id === cartItemToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  // Si l'item n'existe pas on retourne la collection avec 
  // une quantity de 1 
  return [...cartItems, { ...cartItemToAdd, quantity: 1 }];
};

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === cartItemToRemove.id
  );
  
  // Si l'item que l'on souhaite supprimer  a une quantity à 1 
  // on supprime l'item de la collection en retournant la collection
  // sans l'item.
  if (existingCartItem.quantity === 1) {
    return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
  }

  // Si l'item que l'on souhaite supprimer a une quantity supérieure à 1 
  // on retourne la collection avec la quantity de l'item diminuée de 1
  return cartItems.map(cartItem =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};
