import { ADD_BUDGET, UPDATE_BUDGET, DELETE_BUDGET } from '../type/budgetType';

export const addBudget = (budget) => ({
  type: ADD_BUDGET,
  payload: budget,
});

export const updateBudget = (budget) => ({
  type: UPDATE_BUDGET,
  payload: budget,
});

export const deleteBudget = (id) => ({
  type: DELETE_BUDGET,
  payload: id,
});
