import { ADD_BUDGET, UPDATE_BUDGET, DELETE_BUDGET } from '../type/budgetType';
import budgetsData from '@public/data.json'; // initial data

const initialState = { ...budgetsData };

export default function budgetReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BUDGET:
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };

    case DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload.id),
      };

    default:
      return state;
  }
}
