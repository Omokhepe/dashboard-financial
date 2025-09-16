import { ADD_POTS, UPDATE_POTS, DELETE_POTS } from '../type/potType';
import potsData from '@public/data.json'; // initial data

const initialState = { pots: potsData.pots };

export default function potReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_POTS:
      return {
        ...state,
        pots: [...state.pots, action.payload],
      };
    case UPDATE_POTS:
      return {
        ...state,
        pots: state.pots.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };

    case DELETE_POTS:
      return {
        ...state,
        pots: state.pots.filter((b) => b.id !== action.payload.id),
      };

    default:
      return state;
  }
}
