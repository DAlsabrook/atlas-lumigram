import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Page() {
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
            <Text>Search Page</Text>
            <Link href="/profile/1">
                <Text>Profile 1 in search component</Text>
            </Link>
            <Link href="/profile/2">
                <Text>Profile 2 in search component</Text>
            </Link>
        </View>
    )
}
