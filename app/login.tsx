import { Text, View, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";

export default function Page() {
    const router = useRouter();

    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
            <Text>Login Page</Text>
            <Link href="/register" replace>
                <Text>Create new account</Text>
            </Link>

            <Pressable
                onPress={() => {
                    router.replace("/(tabs)")
                }}>
                    <Text>Sign In</Text>
                </Pressable>
        </View>
    )
}
