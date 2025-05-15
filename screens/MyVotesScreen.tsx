import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function MyVotesScreen({ route }: any) {
  const { alias } = route.params;
  const [votesData, setVotesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<"none" | "title" | "score">("none");

  useEffect(() => {
    const fetchVotes = async () => {
      const playerId = await AsyncStorage.getItem("playerId");
      if (!playerId) return;

      try {
        console.log("alias", alias);
        console.log("player", playerId);
        const res = await axios.get(
          `https://ratingapp-be.onrender.com/api/votes/player/${playerId}/board/${alias}`
        );
        setVotesData(res.data);
      } catch (err) {
        console.log("Error fetching votes:", err);
      }

      setLoading(false);
    };

    fetchVotes();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  const getSortedVotes = () => {
    if (sortMode === "title") {
      return [...votesData].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMode === "score") {
      return [...votesData].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }
    return votesData; // original order
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Η Βαθμολογία μου</Text>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Ταξινόμηση:</Text>
        <Text
          style={[
            styles.sortButton,
            sortMode === "none" && styles.sortButtonActive,
          ]}
          onPress={() => setSortMode("none")}
        >
          None
        </Text>
        <Text
          style={[
            styles.sortButton,
            sortMode === "title" && styles.sortButtonActive,
          ]}
          onPress={() => setSortMode("title")}
        >
          Title
        </Text>
        <Text
          style={[
            styles.sortButton,
            sortMode === "score" && styles.sortButtonActive,
          ]}
          onPress={() => setSortMode("score")}
        >
          Score
        </Text>
      </View>

      <FlatList
        data={getSortedVotes()}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.voteCard}>
            <Text style={styles.voteTitle}>{item.title}</Text>
            <Text style={styles.voteScore}>
              Your Score: {item.score ?? "–"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  voteItem: { fontSize: 16, marginBottom: 10 },
  voteCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  voteTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  voteScore: {
    fontSize: 14,
    color: "#555",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  sortLabel: {
    marginRight: 10,
    fontWeight: "bold",
  },
  sortButton: {
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#007aff",
    color: "white",
    borderRadius: 4,
    overflow: "hidden",
  },
  sortButtonActive: {
    backgroundColor: "#005bb5",
  },
});
