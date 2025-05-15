import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function AdminResultsScreen({ route, navigation }: any) {
  const { alias } = route.params;
  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://192.168.0.236:5000/api/boards/alias/${alias}`)
      .then((res) => setBoard(res.data))
      .catch(() => Alert.alert("Board not found"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = () => {
    Alert.alert("Delete Board", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(
              `http://192.168.0.236:5000/api/boards/alias/${alias}`
            );
            Alert.alert("Deleted");
            navigation.goBack();
          } catch {
            Alert.alert("Error deleting board");
          }
        },
      },
    ]);
  };

  if (loading || !board) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Board: {board.name}</Text>
      <FlatList
        data={board.entries}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text style={styles.entry}>
            {item.title} — Avg: {item.averageScore} ({item.totalVotes} votes)
          </Text>
        )}
      />
      <Button title="Delete Board" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, marginBottom: 20 },
  entry: { fontSize: 16, marginBottom: 10 },
});
