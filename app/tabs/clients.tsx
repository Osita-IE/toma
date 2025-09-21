import { router } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase.config";

// Types
type Client = {
  id: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt?: any;
};

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal state
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const arr: Client[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setClients(arr);
        setLoading(false);
      },
      (err) => {
        console.error("clients onSnapshot err", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function openCreateModal() {
    setEditingClientId(null);
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setModalVisible(true);
  }

  function openEditModal(client: Client) {
    setEditingClientId(client.id);
    setForm({
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",
      notes: client.notes || "",
    });
    setModalVisible(true);
  }

  async function saveClient() {
    if (!form.firstName.trim()) {
      Alert.alert("Validation", "Please enter the client's first name.");
      return;
    }

    try {
      if (editingClientId) {
        const clientRef = doc(db, "clients", editingClientId);
        await updateDoc(clientRef, {
          ...form,
          updatedAt: serverTimestamp(),
        });

        await addDoc(collection(db, "history"), {
          clientId: editingClientId,
          action: "updated",
          payload: { ...form },
          timestamp: serverTimestamp(),
        });

        Alert.alert("Success", "Client updated.");
      } else {
        const docRef = await addDoc(collection(db, "clients"), {
          ...form,
          firstName: form.firstName.trim(),
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(db, "history"), {
          clientId: docRef.id,
          action: "created",
          payload: { ...form },
          timestamp: serverTimestamp(),
        });

        Alert.alert("Success", "Client created.");
      }

      setModalVisible(false);
      setEditingClientId(null);
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
    } catch (error) {
      console.error("saveClient error", error);
      Alert.alert("Error", "Could not save client. Check your connection and try again.");
    }
  }

  function goToMeasurements(client: Client) {
    router.push({
      pathname: "/tabs/measurements",
      params: { clientId: client.id, ...client },
    });
  }

  async function goToOrders(client: Client) {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("clientId", "==", client.id));
      const snapshot = await getDocs(q);

      let currentStep = 1;
      let orderId: string | null = null;

      if (!snapshot.empty) {
        // Client already has an order → use the latest
        const orderDoc = snapshot.docs[0];
        const orderData = orderDoc.data();
        currentStep = orderData.currentStep || 1;
        orderId = orderDoc.id;
      } else {
        // No order → create one with currentStep = 1
        const newOrderRef = await addDoc(collection(db, "orders"), {
          clientId: client.id,
          clientName: `${client.firstName} ${client.lastName || ""}`,
          currentStep: 1,
          createdAt: serverTimestamp(),
        });
        orderId = newOrderRef.id;
        currentStep = 1;
      }

      // Navigate to orders tab with the right stage
      router.push({
        pathname: "/tabs/orders",
        params: {
          clientId: client.id,
          clientName: `${client.firstName} ${client.lastName || ""}`,
          orderId,
          currentStep,
        },
      });
    } catch (err) {
      console.error("goToOrders error", err);
      Alert.alert("Error", "Could not load order. Try again.");
    }
  }

  async function removeClient(clientId: string) {
    Alert.alert(
      "Delete client",
      "Are you sure you want to delete this client? This will remove all client data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "clients", clientId));
              await addDoc(collection(db, "history"), {
                clientId,
                action: "deleted",
                timestamp: serverTimestamp(),
              });
              Alert.alert("Deleted", "Client removed.");
            } catch (err) {
              console.error("delete client err", err);
              Alert.alert("Error", "Could not delete client.");
            }
          },
        },
      ]
    );
  }

  function renderClient({ item }: { item: Client }) {
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          {item.phone ? <Text style={styles.sub}>{item.phone}</Text> : null}
          {item.email ? <Text style={styles.sub}>{item.email}</Text> : null}
          {item.address ? <Text style={styles.sub}>{item.address}</Text> : null}
          {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}

          <View style={styles.cardButtons}>
            <TouchableOpacity style={styles.btn} onPress={() => openEditModal(item)}>
              <Text>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => goToMeasurements(item)}>
              <Text>Measurements</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => goToOrders(item)}>
              <Text>Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#ffdddd" }]}
              onPress={() => removeClient(item.id)}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreateModal}>
          <Text style={{ color: "white" }}>+ Add Client</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={renderClient}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No clients yet. Tap "+ Add Client" to start.
            </Text>
          }
        />
      )}

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrap}>
          <Text style={styles.modalTitle}>
            {editingClientId ? "Edit Client" : "New Client"}
          </Text>

          <TextInput
            placeholder="First name *"
            value={form.firstName}
            onChangeText={(t) => setForm((s) => ({ ...s, firstName: t }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            value={form.lastName}
            onChangeText={(t) => setForm((s) => ({ ...s, lastName: t }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(t) => setForm((s) => ({ ...s, phone: t }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(t) => setForm((s) => ({ ...s, email: t }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Address"
            value={form.address}
            onChangeText={(t) => setForm((s) => ({ ...s, address: t }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Notes"
            value={form.notes}
            onChangeText={(t) => setForm((s) => ({ ...s, notes: t }))}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity style={[styles.addBtn, { flex: 1 }]} onPress={saveClient}>
              <Text style={{ color: "white" }}>
                {editingClientId ? "Save" : "Create"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { flex: 1 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#f8fafc",
    padding: 16,
    marginBottom: 14,
    borderRadius: 14,
  },
  name: { fontSize: 18, fontWeight: "600" },
  sub: { color: "#374151" },
  notes: { marginTop: 6, fontStyle: "italic", color: "#6b7280" },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
    flexWrap: "wrap",
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e6f0ff",
  },
  modalWrap: { flex: 1, padding: 16, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});
