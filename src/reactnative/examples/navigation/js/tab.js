import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

function MainNavigation() {
  return (
    <Tab.Navigator>
      {/* Add your stack pages here like this:
      
        <Tab.Screen name="Home" component={HomeScreen} />
      
      */}
    </Tab.Navigator>
  );
}

export default MainNavigation;
