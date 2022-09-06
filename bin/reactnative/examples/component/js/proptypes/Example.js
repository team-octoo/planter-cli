import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './Example.style';
import PropTypes from 'prop-types';

Example.propTypes = {};
Example.defaultProps = {};

function Example (props) {
  return <View>{props.children}</View>;
}

export default Example;
