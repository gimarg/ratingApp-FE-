import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";

export default function AdminBoardScreen({ navigation }: any) {
  const [boardName, setBoardName] = useState("");
  const [alias, setAlias] = useState("");
  const [existingAlias, setExistingAlias] = useState("");

  const createBoard = async () => {
    if (!boardName.trim() || !alias.trim()) {
      return Alert.alert("Enter board name and alias");
    }

    try {
      const res = await axios.post(
        "https://ratingapp-be.onrender.com/api/boards",
        {
          name: boardName.trim(),
          alias: alias.trim(),
        }
      );

      navigation.navigate("AdminDashboard", {
        alias: res.data.alias,
        boardId: res.data._id,
      });
    } catch (err: any) {
      if (err.response?.data?.message === "Alias already used") {
        Alert.alert("Alias already exists");
      } else {
        Alert.alert("Error creating board");
      }
    }
  };

  const accessBoard = async () => {
    if (!existingAlias.trim()) return Alert.alert("Enter an alias");
    try {
      const res = await axios.get(
        `https://ratingapp-be.onrender.com/api/boards/alias/${existingAlias.trim()}`
      );
      navigation.navigate("AdminDashboard", {
        alias: existingAlias.trim(),
        boardId: res.data.boardId,
      });
    } catch {
      Alert.alert("Board not found");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Board</Text>
      <TextInput
        placeholder="Board Name"
        value={boardName}
        onChangeText={setBoardName}
        style={styles.input}
      />
      <TextInput
        placeholder="Alias (e.g. euro25)"
        value={alias}
        onChangeText={setAlias}
        style={styles.input}
      />
      <Button title="Create and Open" onPress={createBoard} />

      <View style={styles.separator} />

      <Text style={styles.title}>Access Existing Board</Text>
      <TextInput
        placeholder="Enter alias"
        value={existingAlias}
        onChangeText={setExistingAlias}
        style={styles.input}
      />
      <Button title="Open Dashboard" onPress={accessBoard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 12 },
  separator: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
