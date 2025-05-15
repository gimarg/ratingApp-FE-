import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export default function PlayerVoteScreen({ route, navigation }: any) {
  const { alias } = route.params;
  const [board, setBoard] = useState<any>(null);
  const [votes, setVotes] = useState<{ [entryId: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [entryId: string]: boolean }>(
    {}
  );
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        const storedId = await AsyncStorage.getItem("playerId");
        const storedName = await AsyncStorage.getItem("playerName");

        if (storedId) setPlayerId(storedId);
        if (storedName) setPlayerName(storedName);

        if (!storedId) {
          const newId = uuid.v4() as string;
          await AsyncStorage.setItem("playerId", newId);
          setPlayerId(newId);
        }
      } catch (err) {
        console.error("Failed to load or store playerId", err);
      }
    };

    getPlayerInfo();
  }, []);

  useEffect(() => {
    axios
      .get(`https://ratingapp-be.onrender.com/api/boards/alias/${alias}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        console.error("Error loading board:", err);
        Alert.alert("Board not found");
      });
  }, []);

  const handleVote = async (entryId: string) => {
    const score = parseInt(votes[entryId]);
    if (isNaN(score) || score < 0 || score > 10) {
      return Alert.alert("Invalid score", "Score must be between 0 and 10.");
    }

    try {
      await axios.post(`https://ratingapp-be.onrender.com/api/boards/vote`, {
        entryId,
        score,
        playerId,
      });

      setSubmitted((prev) => ({ ...prev, [entryId]: true }));
    } catch {
      Alert.alert("Error submitting vote");
    }
  };

  if (!playerId) return <Text>Loading player ID...</Text>;
  if (!board) return <Text>Loading board...</Text>;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>{board.name}</Text>

      <FlatList
        style={styles.list}
        data={board.entries}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <Text style={styles.entryTitle}>{item.title}</Text>

            <TextInput
              placeholder="Score 0–10"
              keyboardType="numeric"
              value={votes[item._id] || ""}
              onChangeText={(val) =>
                setVotes((prev) => ({ ...prev, [item._id]: val }))
              }
              style={styles.input}
            />
            <Button
              title="Submit / Update Vote"
              onPress={() => handleVote(item._id)}
            />
            {submitted[item._id] && (
              <Text style={styles.voted}>✓ Vote Updated</Text>
            )}
          </View>
        )}
      />

      <View style={styles.bottomButton}>
        <Button
          color="#9b56ff"
          title="View My Votes"
          onPress={() => navigation.navigate("MyVotes", { alias })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20 },
  list: { flex: 1 },
  header: { fontSize: 20, marginBottom: 20 },
  entryContainer: { marginBottom: 25 },
  entryTitle: { fontSize: 16, marginBottom: 4 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8 },
  voted: { color: "green", marginTop: 4 },
  bottomButton: { marginTop: 10, marginBottom: 40 },
});
