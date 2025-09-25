import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NewOrderModal from "../../component/newordermodal";
import { db } from "../../config/firebase.config";

// Types
type Measurements = {
  height?: string;
  neck?: string;
  shoulderWidth?: string;
  chest?: string;
  waist?: string;
  hips?: string;
  sleeveLength?: string;
  armholeDepth?: string;
  backLength?: string;
  topLength?: string;
  bottomLength?: string;
  inseam?: string;
  thighCircumference?: string;
  kneeCircumference?: string;
};

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  profilePic?: string;
  notes?: string;
  measurements?: Measurements;
};

type Order = {
  id: string;
  clientId: string;
  garmentType: string;
  status: string;
  deadline?: string;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [addVisible, setAddVisible] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    measurements: {},
  });

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [profileVisible, setProfileVisible] = useState(false);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);

  const [newOrderVisible, setNewOrderVisible] = useState(false);
  const [orderClient, setOrderClient] = useState<Client | null>(null);

  // Fetch clients realtime
  useEffect(() => {
    const q = query(collection(db, "clients"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: Client[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setClients(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch orders for selected client
  useEffect(() => {
    if (!selectedClient) return;
    const q = query(collection(db, "orders"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: Order[] = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .filter((o) => o.clientId === selectedClient.id);
      setClientOrders(arr);
    });
    return () => unsub();
  }, [selectedClient]);

  const handleAddClient = async () => {
    if (!newClient.firstName || !newClient.lastName || !newClient.phone) return;
    await addDoc(collection(db, "clients"), {
      ...newClient,
      createdAt: serverTimestamp(),
    });
    setNewClient({ measurements: {} });
    setAddVisible(false);
  };

  const renderClient = ({ item }: { item: Client }) => {
    const initials =
      item.firstName[0] + (item.lastName ? item.lastName[0] : "");
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedClient(item);
          setProfileVisible(true);
        }}
      >
        {item.profilePic ? (
          <Image source={{ uri: item.profilePic }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: "#7FC7D9" }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>{initials}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.clientName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.clientPhone}>{item.phone}</Text>
        </View>
        <TouchableOpacity
          style={styles.newOrderBtn}
          onPress={() => {
            setOrderClient(item);
            setNewOrderVisible(true);
          }}
        >
          <Text style={{ color: "#fff" }}>+ Order</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const filteredClients = clients.filter(
    (c) =>
      (c.firstName + " " + c.lastName)
        .toLowerCase()
        .includes(search.toLowerCase()) || c.phone.includes(search)
  );

  // Helper: render measurement inputs
  const renderMeasurementInputs = () => {
    const fields = [
      ["height", "Height"],
      ["neck", "Neck"],
      ["shoulderWidth", "Shoulder width"],
      ["chest", "Chest / Bust"],
      ["waist", "Waist"],
      ["hips", "Hips"],
      ["sleeveLength", "Sleeve length"],
      ["armholeDepth", "Armhole depth"],
      ["backLength", "Back length"],
      ["topLength", "Top length"],
      ["bottomLength", "Trouser / Skirt length"],
      ["inseam", "Inseam"],
      ["thighCircumference", "Thigh circumference"],
      ["kneeCircumference", "Knee circumference"],
    ] as [keyof Measurements, string][];

    return (
      <View style={styles.measureGrid}>
        {fields.map(([key, label]) => (
          <View key={key} style={styles.measureItem}>
            <TextInput
              placeholder={label}
              style={styles.measureInput}
              value={newClient.measurements?.[key] || ""}
              onChangeText={(t) =>
                setNewClient({
                  ...newClient,
                  measurements: { ...newClient.measurements, [key]: t },
                })
              }
            />
          </View>
        ))}
      </View>
    );
  };

  // Helper: render measurement display
  const renderMeasurementDisplay = (m?: Measurements) => {
    if (!m) return <Text>No measurements saved.</Text>;
    return (
      <View style={styles.measureGrid}>
        {Object.entries(m).map(([key, val]) =>
          val ? (
            <View key={key} style={styles.measureItem}>
              <Text style={{ fontSize: 12, color: "#0F1035" }}>
                {key}: {val}
              </Text>
            </View>
          ) : null
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          placeholder="Search clients..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#365486"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={filteredClients}
            keyExtractor={(item) => item.id}
            renderItem={renderClient}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No clients found.
              </Text>
            }
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={() => setAddVisible(true)}>
          <Text style={styles.fabText}>+ Add Client</Text>
        </TouchableOpacity>

        {/* Add New Client Modal */}
        <Modal visible={addVisible} animationType="slide">
          <ScrollView style={styles.modalWrap}>
            <Text style={styles.sectionTitle}>Add New Client</Text>
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={newClient.firstName || ""}
              onChangeText={(t) =>
                setNewClient({ ...newClient, firstName: t })
              }
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={newClient.lastName || ""}
              onChangeText={(t) =>
                setNewClient({ ...newClient, lastName: t })
              }
            />
            <TextInput
              placeholder="Phone"
              style={styles.input}
              value={newClient.phone || ""}
              onChangeText={(t) => setNewClient({ ...newClient, phone: t })}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={newClient.email || ""}
              onChangeText={(t) => setNewClient({ ...newClient, email: t })}
            />
            <TextInput
              placeholder="Address"
              style={styles.input}
              value={newClient.address || ""}
              onChangeText={(t) => setNewClient({ ...newClient, address: t })}
            />

            <Text style={styles.sectionTitle}>Measurements</Text>
            {renderMeasurementInputs()}

            <TouchableOpacity
              style={styles.bigButton}
              onPress={handleAddClient}
            >
              <Text style={styles.bigButtonText}>Save Client</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bigButton, { backgroundColor: "#7FC7D9" }]}
              onPress={() => setAddVisible(false)}
            >
              <Text style={styles.bigButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>

        {/* Client Profile Modal */}
        <Modal visible={profileVisible} animationType="slide">
          <ScrollView style={styles.modalWrap}>
            {selectedClient && (
              <>
                <Text style={styles.sectionTitle}>
                  {selectedClient.firstName} {selectedClient.lastName}
                </Text>
                <Text>Phone: {selectedClient.phone}</Text>
                <Text>Email: {selectedClient.email || "-"}</Text>
                <Text>Address: {selectedClient.address || "-"}</Text>

                <Text style={styles.sectionTitle}>Measurements</Text>
                {renderMeasurementDisplay(selectedClient.measurements)}

                <Text style={styles.sectionTitle}>Orders</Text>
                {clientOrders.length > 0 ? (
                  clientOrders.map((o) => (
                    <View key={o.id} style={styles.orderCard}>
                      <Text>{o.garmentType}</Text>
                      <Text>Status: {o.status}</Text>
                      {o.deadline && <Text>Deadline: {o.deadline}</Text>}
                    </View>
                  ))
                ) : (
                  <Text>No orders yet.</Text>
                )}

                <TouchableOpacity
                  style={styles.bigButton}
                  onPress={() => {
                    setOrderClient(selectedClient);
                    setNewOrderVisible(true);
                  }}
                >
                  <Text style={styles.bigButtonText}>+ New Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.bigButton, { backgroundColor: "#7FC7D9" }]}
                  onPress={() => setProfileVisible(false)}
                >
                  <Text style={styles.bigButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </Modal>

        <NewOrderModal
          visible={newOrderVisible}
          onClose={() => {
            setNewOrderVisible(false);
            setOrderClient(null);
          }}
          defaultClient={
            orderClient
              ? {
                  id: orderClient.id,
                  name: `${orderClient.firstName} ${orderClient.lastName}`,
                }
              : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#DCF2F1" },
  container: { flex: 1, padding: 16 },
  searchBar: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  clientName: { fontWeight: "700", fontSize: 16 },
  clientPhone: { color: "#365486" },
  newOrderBtn: {
    backgroundColor: "#365486",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#365486",
    padding: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700" },
  modalWrap: { flex: 1, padding: 16, backgroundColor: "#DCF2F1" },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginVertical: 12 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  bigButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: "#365486",
    marginTop: 10,
    marginBottom: 10,
  },
  bigButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  measureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  measureItem: {
    width: "48%",
    marginBottom: 10,
  },
  measureInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
  },
});
