import React, {FC} from "react";
import {Text, View} from "react-native";
import {styles} from "./Example.style";

const Example: FC<Props> = props => {
  return <View>{props.children}</View>;
};

export default Example;
