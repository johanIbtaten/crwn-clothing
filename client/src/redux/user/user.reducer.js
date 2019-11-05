// On importe les noms des actions relatives au user
import UserActionTypes from './user.types';

// State initial du reducer
const INITIAL_STATE = {
  currentUser: null,
  error: null
};

// Le reducer reçoit le state précédent et une action...
// ...lancée par un dispatch.

const userReducer = (state = INITIAL_STATE, action) => {
  // On regarde le type (le nom) de l'action reçue
  switch (action.type) {
    // Si cette action est reçue,... 
    case UserActionTypes.SIGN_IN_SUCCESS:
      // ...on retourne un nouvel objet (une nouvelle référence)
      // ...pour que le composant qui le recevra dans ses props
      // ... se mette bien à jour. 
      // On spread le state précédent et on met à jour...
      // ...les valeurs du state en utilisant le payload...
      // ... (paramètre passé à l'action) si besoin.
      return {
        ...state,
        currentUser: action.payload,
        error: null
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        error: null
      };
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    // Si aucune action.type ne matche on retourne le state...
    // ...précédent inchangé.
    default:
      return state;
  }
};

export default userReducer;
