import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminDashboardScreen({ route, navigation }: any) {
  const { alias, boardId } = route.params;
  const [entryTitle, setEntryTitle] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBoard = async () => {
    console.log("params", route.params);
    setRefreshing(true);
    try {
      const res = await axios.get(
        `http://192.168.0.236:5000/api/boards/alias/${alias}`
      );
      setEntries(res.data.entries || []);
    } catch {
      Alert.alert("Error loading board data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("params", route.params);
    loadBoard();
  }, []);

  const addEntry = async () => {
    if (!entryTitle.trim()) return;
    try {
      const res = await axios.post(
        `http://192.168.0.236:5000/api/boards/${boardId}/entries`,
        { title: entryTitle.trim() }
      );
      setEntries((prev) => [...prev, res.data]);
      setEntryTitle("");
    } catch {
      Alert.alert("Error adding entry");
    }
  };

  const deleteBoard = () => {
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
            Alert.alert("Board deleted");
            navigation.navigate("AdminBoard");
          } catch {
            Alert.alert("Error deleting board");
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Board: {alias}</Text>
            <TouchableOpacity onPress={loadBoard}>
              <MaterialIcons name="refresh" size={28} color="#007aff" />
            </TouchableOpacity>
          </View>
          {refreshing && <ActivityIndicator style={{ marginBottom: 10 }} />}

          <TextInput
            placeholder="Add Entry (e.g. Italy - Marco)"
            value={entryTitle}
            onChangeText={setEntryTitle}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addEntry}>
            <Text style={styles.addButtonText}>Add Entry</Text>
          </TouchableOpacity>
        </View>
      }
      data={entries}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Text style={styles.entry}>
          • {item.title} — Avg: {item.averageScore ?? "–"}
        </Text>
      )}
      contentContainerStyle={{ padding: 20 }}
      ListFooterComponent={
        <TouchableOpacity style={styles.deleteButton} onPress={deleteBoard}>
          <Text style={styles.deleteText}>Delete Board</Text>
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20 },
  header: { marginBottom: 20 }, // ← ADD THIS
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  input: { borderWidth: 1, marginVertical: 10, padding: 8 },
  entry: { fontSize: 16, marginBottom: 8 },
  addButton: {
    backgroundColor: "#007aff",
    padding: 10,
    alignItems: "center",
    borderRadius: 4,
  },
  addButtonText: { color: "white", fontWeight: "bold" },
  deleteButton: {
    marginTop: 30,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    borderRadius: 4,
  },
  deleteText: { color: "white", fontWeight: "bold" },
});
