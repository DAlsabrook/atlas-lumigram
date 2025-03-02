import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useAuth } from '@/context/AuthContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, firestore } from '@/firebaseConfig';
import Loading from '@/components/Loading';
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
    const [caption, setCaption] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { image, openImagePicker, reset } = useImagePicker();
    const { user } = useAuth();

    const handleSave = async () => {
        if (!image || !user) return;

        setLoading(true);

        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(firestore, 'posts'), {
                imageUrl: downloadURL,
                caption,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            });

            Alert.alert('Post saved');
            reset();
            setCaption('');
        } catch (error) {
            console.error('Error saving post:', error);
            Alert.alert('Failed to save post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {image ? (
                <View>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            ) : (
                <Image source={{ uri: 'https://fakeimg.pl/400x400' }} style={styles.image} />
            )}
            <View style={styles.footerContainer}>
                {!image && (
                    <Pressable style={styles.choosePhotoButton} onPress={openImagePicker}>
                        <Ionicons size={28} name={'image-outline'} color={'white'} />
                        <Text style={styles.choosePhotoButtonText}>Choose a photo</Text>
                    </Pressable>
                )}
                {image && (
                    <View style={styles.buttonContainer}>
                        <View style={{ width: '100%' }}>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a caption"
                                value={caption}
                                onChangeText={setCaption}
                            />
                        </View>
                        <View style={{ width: '90%' }}>
                            <Pressable style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </Pressable>
                            <Pressable style={styles.resetButton} onPress={reset}>
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
            {loading && <Loading />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
    },
    image: {
        width: 320,
        height: 320,
        marginBottom: 30,
        borderRadius: 20,
    },
    footerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 2,
        borderColor: '#ccc',
        marginBottom: 20,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#1DD2AF',
        borderRadius: 8,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginBottom: 50,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    resetButton: {
        alignItems: 'center',
    },
    resetButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    choosePhotoButton: {
        flexDirection: 'row',
        backgroundColor: '#1DD2AF',
        borderRadius: 8,
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    choosePhotoButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});
