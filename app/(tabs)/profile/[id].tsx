import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
    const { id } = useLocalSearchParams();
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
            <Text>User {id} Page</Text>
        </View>
    )
}
