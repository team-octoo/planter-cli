import React from "react";
import {Text, View} from "react-native";
import {styles} from "./Example.style";

const Example = props => {
  return <View>{props.children}</View>;
};

export default Example;
