import {createContext} from "react";

const ExampleContext = createContext({
  example: "",
  setExample: () => {},
});

export default ExampleContext;
