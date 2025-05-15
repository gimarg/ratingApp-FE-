import React from "react";
import { View, Text, Button } from "react-native";

export default function ProfileScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Choose your role:</Text>
      <Button title="Admin" onPress={() => navigation.navigate("AdminBoard")} />
      <Button
        title="Player"
        onPress={() => navigation.navigate("PlayerJoin")}
      />
    </View>
  );
}
