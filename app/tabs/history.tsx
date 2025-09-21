import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase.config";

type HistoryItem = {
  id: string;
  clientId: string;
  action: "created" | "updated" | "measurements_updated";
  payload?: any;
  timestamp?: any;
};

type GroupedHistory = {
  clientId: string;
  actions: HistoryItem[];
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<GroupedHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<GroupedHistory | null>(
    null
  );

  useEffect(() => {
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr: HistoryItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));

        // Group by clientId
        const grouped: Record<string, HistoryItem[]> = {};
        arr.forEach((item) => {
          if (!grouped[item.clientId]) grouped[item.clientId] = [];
          grouped[item.clientId].push(item);
        });

        const groupedArr: GroupedHistory[] = Object.entries(grouped).map(
          ([clientId, actions]) => ({
            clientId,
            actions,
          })
        );

        setHistory(groupedArr);
        setLoading(false);
      },
      (err) => {
        console.error("history onSnapshot error", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // 🗑️ Delete a single client's history
  async function deleteClientHistory(clientId: string) {
    try {
      const q = query(collection(db, "history"));
      const snap = await getDocs(q);
      snap.forEach(async (docSnap) => {
        if (docSnap.data().clientId === clientId) {
          await deleteDoc(doc(db, "history", docSnap.id));
        }
      });
    } catch (err) {
      console.error("deleteClientHistory error", err);
      Alert.alert("Error", "Could not delete client history.");
    }
  }

  // 🧹 Clear all history
  // async function clearAllHistory() {
  //   try {
  //     const q = query(collection(db, "history"));
  //     const snap = await getDocs(q);
  //     snap.forEach(async (docSnap) => {
  //       await deleteDoc(doc(db, "history", docSnap.id));
  //     });
  //   } catch (err) {
  //     console.error("clearAllHistory error", err);
  //     Alert.alert("Error", "Could not clear history.");
  //   }
  // }

  function renderItem({ item }: { item: GroupedHistory }) {
    const latestAction = item.actions[0];
    const clientName =
      latestAction.payload?.firstName && latestAction.payload?.lastName
        ? `${latestAction.payload.firstName} ${latestAction.payload.lastName}`
        : `Client (${item.clientId})`;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setSelectedClient(item)}
        >
          <Text style={styles.clientName}>{clientName}</Text>
          <Text style={styles.actionText}>
            {getActionText(latestAction.action)}
          </Text>
          {latestAction.timestamp?.seconds && (
            <Text style={styles.time}>
              {new Date(latestAction.timestamp.seconds * 1000).toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>

        {/* 🗑️ Delete button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert(
              "Confirm Delete",
              `Delete history for ${clientName}?`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteClientHistory(item.clientId) },
              ]
            )
          }
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function getActionText(action: string) {
    switch (action) {
      case "created":
        return "🆕 Client created";
      case "updated":
        return "✏️ Client updated";
      case "measurements_updated":
        return "📐 Measurements updated";
      default:
        return "";
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {/* 🧹 Clear All button */}
          {/* <TouchableOpacity
            style={styles.clearBtn}
            onPress={() =>
              Alert.alert("Confirm Clear", "Clear all history?", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearAllHistory },
              ])
            }
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Clear All
            </Text>
          </TouchableOpacity> */}

          <FlatList
            data={history}
            keyExtractor={(item) => item.clientId}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No history yet.
              </Text>
            }
          />
        </>
      )}

      {/* Modal for details */}
      <Modal
        visible={!!selectedClient}
        animationType="slide"
        onRequestClose={() => setSelectedClient(null)}
      >
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Client Details</Text>

          {selectedClient?.actions.map((action) => (
            <View key={action.id} style={styles.section}>
              <Text style={styles.actionText}>{getActionText(action.action)}</Text>

              {action.payload && (
                <View style={{ marginTop: 8 }}>
                  {action.payload.firstName && (
                    <Text style={styles.detail}>
                      Name: {action.payload.firstName} {action.payload.lastName}
                    </Text>
                  )}
                  {action.payload.phone && (
                    <Text style={styles.detail}>
                      Phone: {action.payload.phone}
                    </Text>
                  )}
                  {action.payload.email && (
                    <Text style={styles.detail}>
                      Email: {action.payload.email}
                    </Text>
                  )}
                  {action.payload.address && (
                    <Text style={styles.detail}>
                      Address: {action.payload.address}
                    </Text>
                  )}
                  {action.payload.notes && (
                    <Text style={styles.detail}>
                      Notes: {action.payload.notes}
                    </Text>
                  )}
                </View>
              )}

              {action.payload?.measurements && (
                <View style={{ marginTop: 6 }}>
                  <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                    Measurements:
                  </Text>
                  {Object.entries(action.payload.measurements).map(
                    ([key, value]) => (
                      <Text key={key} style={styles.detail}>
                        {key}: {String(value)}
                      </Text>
                    )
                  )}
                </View>
              )}

              {action.timestamp?.seconds && (
                <Text style={styles.time}>
                  {new Date(action.timestamp.seconds * 1000).toLocaleString()}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientName: { 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 6 
  },
  actionText: { 
    fontSize: 14, 
    fontWeight: "600" 
  },
  time: { 
    fontSize: 12, 
    color: "#6b7280", 
    marginTop: 4 
  },
  deleteBtn: {
    backgroundColor: "#9b9b9bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearBtn: {
    backgroundColor: "#9b9b9bff",
    padding: 12,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  modalContent: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff" 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16 
  },
  section: { 
    marginBottom: 20 
  },
  detail: { 
    fontSize: 14, 
    color: "#374151", 
    marginBottom: 2 
  },
});
