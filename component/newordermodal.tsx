import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { db } from "../config/firebase.config";

// ✅ Define props
interface NewOrderModalProps {
  visible: boolean;
  onClose: () => void;
  defaultClient?: {
    id: string;
    name: string;
  } | null;
}

export default function NewOrderModal({
  visible,
  onClose,
  defaultClient,
}: NewOrderModalProps) {
  const initialForm = {
    clientId: defaultClient?.id || "",
    clientName: defaultClient?.name || "",
    garmentType: "",
    deadline: "",
    fabric: "",
    color: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);

  // 🔄 Prefill client info when defaultClient changes
  useEffect(() => {
    if (defaultClient?.id) {
      setForm((prev) => ({
        ...prev,
        clientId: defaultClient.id,
        clientName: defaultClient.name,
      }));

      // still fetch client data in case you want extra info later
      const loadClientData = async () => {
        try {
          const clientRef = doc(db, "clients", defaultClient.id);
          const snap = await getDoc(clientRef);
          if (!snap.exists()) return;
        } catch (err) {
          console.log("Error loading client:", err);
        }
      };

      loadClientData();
    } else {
      setForm(initialForm); // reset if no default client
    }
  }, [defaultClient]);

  const handleSave = async () => {
    if (!form.clientId || !form.garmentType) return;

    try {
      // Save the new order
      await addDoc(collection(db, "orders"), {
        ...form,
        status: "Pending",
        currentStep: 1,
        createdAt: serverTimestamp(),
      });

      // Reset form (keep client prefilled if defaultClient)
      setForm((prev) => ({
        ...initialForm,
        clientId: defaultClient?.id || "",
        clientName: defaultClient?.name || "",
      }));
    } catch (err) {
      console.error("Error saving order:", err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView
        style={{ flex: 1, padding: 16, backgroundColor: "#DCF2F1" }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>New Order</Text>

        {/* Client field (prefilled if opened from clients.tsx) */}
        <TextInput
          placeholder="Client Name"
          style={styles.input}
          value={form.clientName}
          editable={!defaultClient}
          onChangeText={(t) => setForm({ ...form, clientName: t })}
        />

        <TextInput
          placeholder="Garment Type"
          style={styles.input}
          value={form.garmentType}
          onChangeText={(t) => setForm({ ...form, garmentType: t })}
        />
        <TextInput
          placeholder="Deadline"
          style={styles.input}
          value={form.deadline}
          onChangeText={(t) => setForm({ ...form, deadline: t })}
        />
        <TextInput
          placeholder="Fabric"
          style={styles.input}
          value={form.fabric}
          onChangeText={(t) => setForm({ ...form, fabric: t })}
        />
        <TextInput
          placeholder="Color"
          style={styles.input}
          value={form.color}
          onChangeText={(t) => setForm({ ...form, color: t })}
        />

        {/* ✅ Only Notes kept */}
        <TextInput
          placeholder="Notes"
          style={[styles.input, { minHeight: 80 }]}
          value={form.notes}
          onChangeText={(t) => setForm({ ...form, notes: t })}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#7FC7D9" }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#0F1035" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  button: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#365486",
    marginVertical: 6,
  },
  buttonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
