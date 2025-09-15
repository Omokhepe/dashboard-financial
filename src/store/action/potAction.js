import { ADD_POTS, UPDATE_POTS, DELETE_POTS } from '../type/potType';

export const addPots = (pot) => ({
  type: ADD_POTS,
  payload: pot,
});

export const updatePots = (pot) => ({
  type: UPDATE_POTS,
  payload: pot,
});

export const deletePot = (id) => ({
  type: DELETE_POTS,
  payload: id,
});
