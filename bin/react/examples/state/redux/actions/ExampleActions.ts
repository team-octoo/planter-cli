export const ExampleTypes = {
  RESET: "EXAMPLE:RESET"
};

const ExampleActions = {
  resetExample: () => {
    return (dispatch) => {
      dispatch({ type: ExampleTypes.RESET });
    }; 
  }
};

export default ExampleActions;