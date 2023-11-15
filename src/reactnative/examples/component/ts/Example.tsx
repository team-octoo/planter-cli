import React, {FC, PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import {styles} from './Example.style';

const Example: FC<PropsWithChildren> = props => {
  return <View>{props.children}</View>;
};

export default Example;
