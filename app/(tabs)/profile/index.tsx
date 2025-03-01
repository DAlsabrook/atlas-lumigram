import { useAuth } from "@/context/AuthContext";
import { Text, View } from "react-native";

export default function Page() {
    const user = useAuth();

    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
            <Text>Profile for {user.user?.email}</Text>
        </View>
    )
}
