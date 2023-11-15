import React, {FC} from 'react';
import {View, ViewProps} from 'react-native';
import {styles} from './Example.style';

type Props = {} & Pick<ViewProps, 'children'>;

const Example: FC<Props> = ({children}) => {
  return <View>{children}</View>;
};

export default Example;
