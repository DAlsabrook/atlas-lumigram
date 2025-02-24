import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Page() {
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
            <Text>Register Page</Text>
            <Link href="/login" replace>
                <Text>Back to Log in</Text>
            </Link>
        </View>
    )
}
