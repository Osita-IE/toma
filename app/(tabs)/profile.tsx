import { auth, db } from "@/config/firebase.config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser(data);
          setForm(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  async function handleSave() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await setDoc(doc(db, "users", currentUser.uid), form, { merge: true });
      setUser(form);
      setEditing(false);
      Alert.alert("Profile Updated", "Your profile has been saved.");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile.");
    }
  }

  function handleCancel() {
    setForm(user); // reset form to user data
    setEditing(false);
  }

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/(login)/start");
          } catch (err) {
            console.error("Logout failed:", err);
          }
        },
      },
    ]);
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={100} color="#365486" />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.section}>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={form.phone}
                onChangeText={(text) => setForm({ ...form, phone: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChangeText={(text) => setForm({ ...form, address: text })}
              />

              {form.role === "Tailor" && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Name"
                    value={form.shopName}
                    onChangeText={(text) =>
                      setForm({ ...form, shopName: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Specialization"
                    value={form.specialization}
                    onChangeText={(text) =>
                      setForm({ ...form, specialization: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Experience"
                    value={form.experience}
                    onChangeText={(text) =>
                      setForm({ ...form, experience: text })
                    }
                  />
                </>
              )}

              {/* Save + Cancel row */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#7FC7D9", flex: 1, marginRight: 6 }]}
                  onPress={handleCancel}
                >
                  <Ionicons name="close-outline" size={20} color="#fff" />
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { flex: 1, marginLeft: 6 }]}
                  onPress={handleSave}
                >
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.detail}>📧 {user.email}</Text>
              <Text style={styles.detail}>📞 {user.phone}</Text>
              <Text style={styles.detail}>🏠 {user.address}</Text>

              {user.role === "Tailor" && (
                <>
                  <Text style={styles.detail}>🏪 Shop: {user.shopName}</Text>
                  <Text style={styles.detail}>
                    🧵 Specialization: {user.specialization}
                  </Text>
                  <Text style={styles.detail}>
                    ⏳ Experience: {user.experience}
                  </Text>
                </>
              )}
            </>
          )}
        </View>

        {/* Actions */}
        {!editing && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setEditing(true)}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#0F1035" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DCF2F1",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    color: "#0F1035",
  },
  role: {
    fontSize: 16,
    fontWeight: "600",
    color: "#365486",
    marginTop: 2,
  },
  section: {
    backgroundColor: "#EAF6F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#7FC7D9",
  },
  detail: {
    fontSize: 14,
    color: "#365486",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#365486",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
