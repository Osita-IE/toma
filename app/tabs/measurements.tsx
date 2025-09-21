import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { db } from "../../config/firebase.config";

type Measurements = {
  chest?: string;
  waist?: string;
  hips?: string;
  sleeve?: string;
  length?: string;
  neck?: string;
  inseam?: string;
  [key: string]: string | undefined;
};

export default function Measurements() {
  const { clientId, firstName, lastName } = useLocalSearchParams();
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: "",
    waist: "",
    hips: "",
    sleeve: "",
    length: "",
    neck: "",
    inseam: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Real-time listener instead of getDoc
  useEffect(() => {
    if (!clientId) return;

    const ref = doc(db, "measurements", clientId as string);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMeasurements(snap.data() as Measurements);
      }
      setLoading(false); // ✅ stop blocking after first snapshot
    });

    return unsub;
  }, [clientId]);

  async function saveMeasurements() {
    if (!clientId) {
      Alert.alert("Error", "Client ID is missing.");
      return;
    }

    try {
      setSaving(true);
      const ref = doc(db, "measurements", clientId as string);

      await setDoc(
        ref,
        {
          ...measurements,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Add to history
      await addDoc(collection(db, "history"), {
        clientId,
        action: "measurements_updated",
        payload: { ...measurements },
        timestamp: serverTimestamp(),
      });

      // ✅ Clear form after save
      setMeasurements({
        chest: "",
        waist: "",
        hips: "",
        sleeve: "",
        length: "",
        neck: "",
        inseam: "",
      });

      Alert.alert("Success", "Measurements saved!");
    } catch (err) {
      console.error("saveMeasurements error", err);
      Alert.alert("Error", "Could not save measurements.");
    } finally {
      setSaving(false);
    }
  }

  function renderInput(label: string, key: keyof Measurements) {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={measurements[key] || ""}
          onChangeText={(t) => setMeasurements((s) => ({ ...s, [key]: t }))}
          placeholder={`Enter ${label.toLowerCase()}`}
          keyboardType="numeric"
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 10 }}>Loading measurements...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Measurements for {firstName} {lastName}
      </Text>

      {renderInput("Chest", "chest")}
      {renderInput("Waist", "waist")}
      {renderInput("Hips", "hips")}
      {renderInput("Sleeve", "sleeve")}
      {renderInput("Length", "length")}
      {renderInput("Neck", "neck")}
      {renderInput("Inseam", "inseam")}

      <TouchableOpacity
        style={[
          styles.saveBtn,
          saving && { backgroundColor: "#9ca3af" },
        ]}
        onPress={saveMeasurements}
        disabled={saving}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {saving ? "Saving..." : "Save Measurements"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});
