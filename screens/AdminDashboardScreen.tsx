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

  const ADMIN_PASSWORD = "17181920"; // hardcoded

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const [passwordInput, setPasswordInput] = useState("");

  const loadBoard = async () => {
    console.log("params", route.params);
    setRefreshing(true);
    try {
      const res = await axios.get(
        `https://ratingapp-be.onrender.com/api/boards/alias/${alias}`
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
        `https://ratingapp-be.onrender.com/api/boards/${boardId}/entries`,
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
              `https://ratingapp-be.onrender.com/api/boards/alias/${alias}`
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

  const getSortedEntries = () => {
    return [...entries].sort((a, b) => {
      const aScore = a.averageScore ?? 0;
      const bScore = b.averageScore ?? 0;

      // Sort by averageScore descending, fallback to title
      if (bScore !== aScore) return bScore - aScore;
      return a.title.localeCompare(b.title);
    });
  };

  const requestPassword = (action: () => void) => {
    setPendingAction(() => action); // save the action to run after auth
    setPasswordInput("");
    setShowPasswordModal(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {showPasswordModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Admin Password</Text>
            <TextInput
              secureTextEntry
              style={styles.modalInput}
              placeholder="Password"
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => {
                  if (passwordInput === ADMIN_PASSWORD) {
                    setShowPasswordModal(false);
                    pendingAction();
                  } else {
                    Alert.alert("Incorrect password");
                  }
                }}
              >
                <Text style={[styles.modalButtonText, styles.modalConfirmText]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
        data={getSortedEntries()}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryScore}>
              Avg. Score: {item.averageScore ?? "–"}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => requestPassword(deleteBoard)}
          >
            <Text style={styles.deleteText}>Delete Board</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20 },
  header: { marginBottom: 20 },
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
    marginBottom: 100,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    borderRadius: 4,
  },
  deleteText: { color: "white", fontWeight: "bold" },
  entryCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  entryScore: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#007aff",
    fontWeight: "bold",
  },
  modalConfirmButton: {
    backgroundColor: "#007aff",
    borderRadius: 6,
  },
  modalConfirmText: {
    color: "white",
  },
});
