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

  useEffect(() => {
    const fetchVotes = async () => {
      const playerId = await AsyncStorage.getItem("playerId");
      if (!playerId) return;

      try {
        console.log("alias", alias);
        console.log("player", playerId);
        const res = await axios.get(
          `http://192.168.0.236:5000/api/votes/player/${playerId}/board/${alias}`
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Votes</Text>
      <FlatList
        data={votesData}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Text style={styles.voteItem}>
            {item.title}: {item.score ?? "–"}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  voteItem: { fontSize: 16, marginBottom: 10 },
});
