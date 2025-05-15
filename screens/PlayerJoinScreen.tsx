import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function PlayerJoinScreen({ navigation }: any) {
  const [alias, setAlias] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!alias.trim() || !name.trim()) {
      return Alert.alert("Please enter both name and board alias.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://ratingapp-be.onrender.com/api/players/login",
        {
          name: name.trim(),
        }
      );

      const { playerId } = res.data;

      await AsyncStorage.setItem("playerId", playerId);
      await AsyncStorage.setItem("playerName", name.trim());

      navigation.navigate("PlayerVote", { alias: alias.trim() });
    } catch (err) {
      Alert.alert("Login failed", "Could not log in with that name.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={styles.input}
      />

      <Text style={styles.label}>Enter board alias:</Text>
      <TextInput
        value={alias}
        onChangeText={setAlias}
        placeholder="Board alias"
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 10 }} />
      ) : (
        <Button title="Join Board" onPress={handleJoin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 },
  label: { marginTop: 10 },
});
