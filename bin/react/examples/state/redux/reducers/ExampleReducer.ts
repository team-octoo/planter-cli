import produce from "immer";
import {ExampleTypes} from "../actions/ExampleActions";

export const initialState = {};

const ExampleReducer = (previousState = initialState, action) => {
  return produce(previousState, newState => {
    switch (action.type) {
      case ExampleTypes.RESET:
        newState = initialState;
        return newState;

      default:
        return previousState;
    }
  });
};

export default ExampleReducer;
