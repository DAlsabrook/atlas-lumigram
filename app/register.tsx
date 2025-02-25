import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
const logo = require('@/assets/images/logo.png')

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Image
                source={logo}
                style={styles.image}
            />
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B0B0B0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Pressable
                style={styles.button}
                onPress={() => {
                    Alert.alert('Account Created')
                    router.replace("/(tabs)");
                }}
            >
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>
            <Link href="/login" replace>
                <Text style={styles.link}>Login to existing account</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: "#00003C"
    },
    image: {
        width: "90%",
        height: "18%",
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        color: "white"
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#1DD2AF',
        borderRadius: 8,
        marginBottom: 10,
        color: "white"
    },
    link: {
        color: 'white',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#1DD2AF',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 15,
        width: '100%',
        textAlign: "center",
        color: "white"
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: "center"
    },
});
