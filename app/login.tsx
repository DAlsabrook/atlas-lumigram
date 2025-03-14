import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

const logo = require('@/assets/images/logo.png');

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) router.replace("/(tabs)");
        } catch (error) {
            setError('Failed to sign in.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={logo}
                style={styles.image}
            />
            <Text style={styles.title}>Login</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <Link href="/register" replace>
                <Text style={styles.link}>Create new account</Text>
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
    errorText: {
        color: 'red',
        marginBottom: 16,
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
