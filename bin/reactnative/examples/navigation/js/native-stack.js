import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function MainNavigation() {
  return (
    <Stack.Navigator>
      {/* Add your stack pages here like this:

         <Stack.Screen name="Home" component={Home} />

       */}
    </Stack.Navigator>
  );
}

export default MainNavigation;
