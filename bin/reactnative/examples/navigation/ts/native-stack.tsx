import React, {FC} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import RootStackParamList from "./MainNavigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation: FC = () => {
  return (
    <Stack.Navigator>
      {/* Add your stack pages here like this:

         <Stack.Screen name="Home" component={Home} />

       */}
    </Stack.Navigator>
  );
};

export default MainNavigation;
