import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "./screens/ProfileScreen";
import AdminBoardScreen from "./screens/AdminBoardScreen";
import PlayerJoinScreen from "./screens/PlayerJoinScreen";
import PlayerVoteScreen from "./screens/PlayerVoteScreen";
import AdminResultsScreen from "./screens/AdminResultsScreen";
import MyVotesScreen from "./screens/MyVotesScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AdminBoard" component={AdminBoardScreen} />
        <Stack.Screen name="PlayerJoin" component={PlayerJoinScreen} />
        <Stack.Screen name="PlayerVote" component={PlayerVoteScreen} />
        <Stack.Screen name="AdminResults" component={AdminResultsScreen} />
        <Stack.Screen name="MyVotes" component={MyVotesScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
