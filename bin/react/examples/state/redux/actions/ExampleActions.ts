export const ExampleTypes = {
  RESET: "RESET"
};

const ExampleActions = {
  resetExample: () => {
    return (dispatch) => {
      dispatch({ type: ExampleTypes.RESET });
    }; 
  }
};

export default ExampleActions;