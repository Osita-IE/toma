import { Ionicons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { db } from "../../config/firebase.config";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
};

type Order = {
  id: string;
  garmentType: string;
  deliveryDate: string;
  status: string;
  clientId: string;
};

export default function History() {
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const unsubClients = onSnapshot(collection(db, "clients"), (snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });

    setLoading(false);
    return () => {
      unsubClients();
      unsubOrders();
    };
  }, []);

  // 🗑️ Delete a single client + their orders
  async function deleteClient(clientId: string) {
    try {
      await deleteDoc(doc(db, "clients", clientId));
      const q = query(collection(db, "orders"), where("clientId", "==", clientId));
      const snap = await getDocs(q);
      snap.forEach(async (d) => await deleteDoc(d.ref));
    } catch (err) {
      console.error("deleteClient error", err);
      Alert.alert("Error", "Could not delete client.");
    }
  }

  // 🧹 Clear all history
  async function clearAll() {
    Alert.alert("Clear All", "This will remove all clients and orders.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete All",
        style: "destructive",
        onPress: async () => {
          try {
            const cSnap = await getDocs(collection(db, "clients"));
            cSnap.forEach(async (d) => await deleteDoc(d.ref));
            const oSnap = await getDocs(collection(db, "orders"));
            oSnap.forEach(async (d) => await deleteDoc(d.ref));
          } catch (err) {
            console.error("clearAll error", err);
          }
        },
      },
    ]);
  }

  function renderItem({ item }: { item: Client }) {
    const clientOrders = orders.filter((o) => o.clientId === item.id);

    return (
      <View style={styles.card}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedClient(item)}>
          <Text style={styles.clientName}>
            {item.firstName} {item.lastName}
          </Text>
          {clientOrders.length > 0 ? (
            <Text style={styles.actionText}>{clientOrders.length} order(s)</Text>
          ) : (
            <Text style={styles.actionText}>No orders yet</Text>
          )}
        </TouchableOpacity>

        {/* 🗑️ Delete button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert(
              "Confirm Delete",
              `Delete ${item.firstName}'s data?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteClient(item.id),
                },
              ]
            )
          }
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#365486" />
          </View>
        ) : (
          <>

          <Text style={styles.historyTitle}>History</Text>

            <FlatList
              data={clients}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20, color: "#0F1035" }}>
                  No history yet.
                </Text>
              }
            />
          </>
        )}

        {/* 🧹 Floating clear all button */}
        {clients.length > 0 && (
          <TouchableOpacity style={styles.fab} onPress={clearAll}>
            <Ionicons name="trash-bin" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Modal with client + orders */}
        <Modal
          visible={!!selectedClient}
          animationType="slide"
          onRequestClose={() => setSelectedClient(null)}
        >
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Client Details</Text>
            {selectedClient && (
              <View style={styles.section}>
                <Text style={styles.detail}>
                  Name: {selectedClient.firstName} {selectedClient.lastName}
                </Text>
                {selectedClient.phone && (
                  <Text style={styles.detail}>Phone: {selectedClient.phone}</Text>
                )}
                {selectedClient.email && (
                  <Text style={styles.detail}>Email: {selectedClient.email}</Text>
                )}
                {selectedClient.address && (
                  <Text style={styles.detail}>Address: {selectedClient.address}</Text>
                )}
                {selectedClient.notes && (
                  <Text style={styles.detail}>Notes: {selectedClient.notes}</Text>
                )}

                {/* Orders for this client */}
                <Text style={styles.measurementsTitle}>Orders:</Text>
                {orders
                  .filter((o) => o.clientId === selectedClient.id)
                  .map((o) => (
                    <View key={o.id} style={styles.orderCard}>
                      <Text style={styles.detail}>Garment: {o.garmentType}</Text>
                      <Text style={styles.detail}>Delivery: {o.deliveryDate}</Text>
                      <Text style={styles.detail}>Status: {o.status}</Text>
                    </View>
                  ))}
              </View>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedClient(null)}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Close
            </Text>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DCF2F1",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // ✅ Fix for Android
  },
  container: {
    flex: 1,
    backgroundColor: "#DCF2F1",
  },
  historyTitle: {
  fontSize: 22,
  fontWeight: "800",
  textAlign: "left",
  marginVertical: 12,
  color: "#0F1035",
  marginLeft: 20
},

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCF2F1",
  },
  card: {
    backgroundColor: "#EAF6F6",
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#365486",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: "#7FC7D9",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0F1035",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#365486",
  },
  deleteBtn: {
    backgroundColor: "#0F1035",
    padding: 8,
    borderRadius: 6,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#365486",
    padding: 16,
    borderRadius: 30,
    elevation: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#DCF2F1",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0F1035",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#7FC7D9",
  },
  detail: {
    fontSize: 14,
    color: "#365486",
    marginBottom: 2,
  },
  measurementsTitle: {
    fontWeight: "700",
    color: "#365486",
    marginVertical: 8,
    fontSize: 15,
  },
  orderCard: {
    backgroundColor: "#EAF6F6",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  closeBtn: {
    backgroundColor: "#365486",
    padding: 14,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
});
