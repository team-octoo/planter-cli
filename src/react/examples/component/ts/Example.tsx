import {ReactNode} from "react";

interface PropsInterface {
  children: ReactNode;
}

const Example = ({children}: PropsInterface) => {
  return <>{children}</>;
};

export default Example;
