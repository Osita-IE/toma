import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { db } from "../../config/firebase.config";

// 🔹 Tailoring Steps
const steps = [
  { id: 1, title: "Measurement Taken", description: "Your body measurements have been recorded." },
  { id: 2, title: "Fabric Cut", description: "Fabric has been cut based on your design." },
  { id: 3, title: "Sewing in Progress", description: "Your garment is being sewn." },
  { id: 4, title: "Fitting Scheduled", description: "A fitting session has been scheduled." },
  { id: 5, title: "Ready for Pickup", description: "Your order is complete and ready for pickup." },
];

export default function GarmentOrderScreen() {
  const { orderId } = useLocalSearchParams(); // ✅ Read ID from route params
  const [currentStep, setCurrentStep] = useState(1);

  // 🔹 Garment details
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [length, setLength] = useState("");
  const [notes, setNotes] = useState("");

  // 🔹 Listen for live updates
  useEffect(() => {
    if (!orderId) return;

    const ref = doc(db, "orders", orderId as string);
    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentStep(data?.currentStep ?? 1);

        setFabric(data?.fabric ?? "");
        setColor(data?.color ?? "");
        setLength(data?.length ?? "");
        setNotes(data?.notes ?? "");
      }
    });

    return () => unsub();
  }, [orderId]);

  // 🔹 Move to next step
  const handleNextStep = async () => {
    if (!orderId) return Alert.alert("Error", "Order ID is missing.");
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);

      try {
        await updateDoc(doc(db, "orders", orderId as string), { currentStep: newStep });
      } catch (err) {
        console.error("Error updating step:", err);
        Alert.alert("Error", "Could not update step.");
      }
    }
  };

  // 🔹 Save garment & design details
  const handleSaveDetails = async () => {
    if (!orderId) return Alert.alert("Error", "Order ID is missing.");

    try {
      await updateDoc(doc(db, "orders", orderId as string), {
        fabric: fabric ?? "",
        color: color ?? "",
        length: length ?? "",
        notes: notes ?? "",
      });
      Alert.alert("Success", "Garment details saved!");
    } catch (err) {
      console.error("Error saving garment details:", err);
      Alert.alert("Error", "Could not save garment details.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Garment and Design Details */}
      <Text style={styles.sectionTitle}>Garment & Design Details</Text>

      <TextInput
        label="Fabric Type"
        placeholder="e.g. Cotton, Silk"
        value={fabric}
        onChangeText={setFabric}
        style={styles.input}
      />
      <TextInput
        label="Material Color"
        placeholder="e.g. Blue, Red"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />
      <TextInput
        label="Material Length"
        placeholder="e.g. 3 yards"
        value={length}
        onChangeText={setLength}
        style={styles.input}
      />
      <TextInput
        label="Custom Notes"
        placeholder="Any special instructions..."
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        multiline
      />

      <Button mode="contained" style={styles.saveButton} onPress={handleSaveDetails}>
        Save Details
      </Button>

      {/* 🔹 Order Progress */}
      <Text style={styles.sectionTitle}>Order Progress</Text>

      <View style={styles.timeline}>
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <View key={step.id} style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}
              >
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              {index < steps.length - 1 && <View style={styles.line} />}
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.stepTitle,
                    isActive && styles.activeText,
                    isCompleted && styles.completedText,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <Button mode="contained" style={styles.button} onPress={handleNextStep}>
        {currentStep < steps.length ? "Move to Next Step" : "Completed"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  saveButton: { backgroundColor: "#4B6FFF", marginBottom: 20 },
  timeline: { marginVertical: 10 },
  stepContainer: { marginBottom: 40, position: "relative", flexDirection: "row", alignItems: "flex-start" },
  circle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: "#ccc", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", zIndex: 1 },
  activeCircle: { borderColor: "#4B6FFF", backgroundColor: "#4B6FFF" },
  completedCircle: { borderColor: "#4B6FFF", backgroundColor: "#4B6FFF" },
  checkmark: { color: "white", fontWeight: "bold", fontSize: 14 },
  line: { position: "absolute", left: 12, top: 26, bottom: -40, width: 2, backgroundColor: "#ccc" },
  textContainer: { marginLeft: 16, flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: "bold", color: "#999" },
  stepDescription: { fontSize: 14, color: "#666" },
  activeText: { color: "#4B6FFF" },
  completedText: { color: "#333" },
  button: { marginBottom: 30, backgroundColor: "#9b9b9bff" },
});
