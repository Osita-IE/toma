import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NewOrderModal from "../../component/newordermodal";
import { db } from "../../config/firebase.config";

// ---------- Types ----------
type Order = {
  id?: string;
  clientId?: string;
  clientName?: string;
  garmentType?: string;
  deadline?: string;
  status?: string;
  fabric?: string;
  color?: string;
  notes?: string;
  designNotes?: string;
  deposit?: number;
  balance?: number;
  currentStep?: number;
  createdAt?: any;
};

const ORDER_STEPS = [
  { id: 1, title: "Pending" },
  { id: 2, title: "In Progress" },
  { id: 3, title: "Fitting" },
  { id: 4, title: "Completed" },
  { id: 5, title: "Delivered" },
];

const FILTERS = ["All", "Pending", "In Progress", "Fitting", "Completed"];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  // Details modal
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedClientOrders, setSelectedClientOrders] = useState<Order[]>([]);

  // New Order modal
  const [newOrderVisible, setNewOrderVisible] = useState(false);

  // ---------- Fetch orders (real-time) ----------
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr: Order[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setOrders(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Orders subscription error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // ---------- Filter logic ----------
  useEffect(() => {
    const f =
      activeFilter === "All"
        ? orders
        : orders.filter((o) => o.status === activeFilter);
    setFiltered(f);
  }, [activeFilter, orders]);

  // ---------- Helpers ----------
  const openClientDetails = (clientName: string) => {
    const clientOrders = orders.filter((o) => o.clientName === clientName);
    setSelectedClientOrders(clientOrders);
    setDetailsVisible(true);
  };

  const advanceStep = async (order: Order | null) => {
    if (!order || !order.id) return;
    const next = (order.currentStep || 1) + 1;
    if (next > ORDER_STEPS.length) return;
    try {
      await updateDoc(doc(db, "orders", order.id), {
        currentStep: next,
        status: ORDER_STEPS[next - 1].title,
      });
      setSelectedClientOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, currentStep: next, status: ORDER_STEPS[next - 1].title }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not advance the order stage.");
    }
  };

  const sendUpdateToCustomer = async (order: Order | null, message: string) => {
    if (!order || !order.id) return;
    try {
      await addDoc(collection(db, "notifications"), {
        orderId: order.id,
        clientId: order.clientId,
        clientName: order.clientName,
        message,
        createdAt: serverTimestamp(),
      });
      Alert.alert("Sent", "Update sent to the customer.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not send update.");
    }
  };

  // ---------- UI pieces ----------
  const ClientCard = ({ clientName }: { clientName: string }) => {
    const clientOrders = orders.filter((o) => o.clientName === clientName);
    const latestOrder = clientOrders[0];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openClientDetails(clientName)}
      >
        <Text style={styles.clientName}>{clientName}</Text>
        <Text style={styles.gridItem}>
          Latest Order: {latestOrder.garmentType} ({latestOrder.status})
        </Text>
      </TouchableOpacity>
    );
  };

  const Stepper = ({ order }: { order: Order | null }) => {
    const step = order?.currentStep || 1;
    return (
      <View style={styles.stepperWrap}>
        {ORDER_STEPS.map((s, idx) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <View key={s.id} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive ? styles.stepCircleActive : null,
                  isDone ? styles.stepCircleDone : null,
                ]}
              >
                <Text style={styles.stepCircleText}>
                  {isDone ? "✓" : s.id}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive ? styles.stepLabelActive : null,
                ]}
              >
                {s.title}
              </Text>
              {idx < ORDER_STEPS.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isDone ? styles.connectorDone : null,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // ---------- Render ----------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Orders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setNewOrderVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Order</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.tab, activeFilter === f && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeFilter === f && { color: "white" }]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={[...new Set(filtered.map((o) => o.clientName))]} // unique client names
          keyExtractor={(i) => i || Math.random().toString()}
          renderItem={({ item }) => <ClientCard clientName={item!} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 24 }}>No orders</Text>
          }
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Details modal */}
      <Modal visible={detailsVisible} animationType="slide">
        <SafeAreaView style={styles.modalSafe}>
          <TouchableOpacity
            onPress={() => setDetailsVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>X</Text>
          </TouchableOpacity>

          <ScrollView style={{ padding: 16 }}>
            {selectedClientOrders.map((order) => (
              <View key={order.id} style={styles.sectionCard}>
                <Text style={styles.smallLabel}>Order Details & Progress</Text>

                <Text style={styles.gridItem}>
                  Type: {order.garmentType}
                </Text>
                <Text style={styles.gridItem}>
                  Deadline: {order.deadline || "-"}
                </Text>
                <Text style={styles.gridItem}>
                  Fabric: {order.fabric || "-"}
                </Text>
                <Text style={styles.gridItem}>
                  Color: {order.color || "-"}
                </Text>
                <Text style={styles.notes}>
                  Notes: {order.designNotes || order.notes || "-"}
                </Text>

                <Text style={[styles.smallLabel, { marginTop: 12 }]}>
                  Progress
                </Text>
                <Stepper order={order} />

                <View style={styles.progressButtons}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => advanceStep(order)}
                  >
                    <Text style={styles.secondaryButtonText}>Next Step</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                      sendUpdateToCustomer(
                        order,
                        `Order status: ${order.status}`
                      )
                    }
                  >
                    <Text style={styles.secondaryButtonText}>Send Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Reusable Add Order Modal */}
      <NewOrderModal
        visible={newOrderVisible}
        onClose={() => setNewOrderVisible(false)}
      />
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#DCF2F1", paddingTop: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: { fontSize: 28, fontWeight: "800", color: "#0F1035" },
  addButton: {
    backgroundColor: "#365486",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addButtonText: { color: "white", fontWeight: "700" },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#7FC7D9",
  },
  activeTab: { backgroundColor: "#365486" },
  tabText: { color: "#0F1035", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#365486",
    shadowColor: "#0F1035",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  clientName: { fontWeight: "700", fontSize: 16, marginBottom: 4, color: "#0F1035" },
  gridItem: { flex: 1, fontSize: 13, color: "#365486", marginBottom: 4 },
  notes: { marginTop: 6, fontSize: 13, color: "#0F1035" },
  modalSafe: { flex: 1, backgroundColor: "#DCF2F1" },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#365486",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  sectionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(53,84,134,0.06)",
  },
  smallLabel: { fontSize: 12, fontWeight: "700", color: "#365486", marginBottom: 6 },
  stepperWrap: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", marginTop: 8 },
  stepItem: { alignItems: "center", marginHorizontal: 6, position: "relative" },
  stepCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#7FC7D9", alignItems: "center", justifyContent: "center", backgroundColor: "white" },
  stepCircleActive: { borderColor: "#365486" },
  stepCircleDone: { backgroundColor: "#365486", borderColor: "#365486" },
  stepCircleText: { fontWeight: "700", color: "#0F1035" },
  stepLabel: { marginTop: 6, fontSize: 12, textAlign: "center" },
  stepLabelActive: { color: "#365486", fontWeight: "800" },
  connector: { position: "absolute", height: 4, width: 50, backgroundColor: "#E6F6F6", left: 40, top: 16, zIndex: -1 },
  connectorDone: { backgroundColor: "#365486" },
  progressButtons: { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 16 },
  secondaryButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#365486" },
  secondaryButtonText: { color: "white", fontWeight: "700" },
});
