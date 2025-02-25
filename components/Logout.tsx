import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function Logout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const iconColor = '#1DD2AF';

    function logout() {
        router.replace("/login");
    }

    return (
        <Pressable onPress={logout}>
            <Ionicons name='log-out-outline' size={24} color={iconColor} style={{ marginRight: 16 }} />
        </Pressable>
    );
}
