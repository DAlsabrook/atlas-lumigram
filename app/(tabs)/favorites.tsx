import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { GestureHandlerRootView, LongPressGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/ThemedView';
import { collection, query, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

type FavoriteItem = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: any;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const [bubbleCaption, setBubbleCaption] = useState('');
  const { user } = useAuth();

  const fetchFavorites = async (refresh = false) => {
    if (!user) return;
    if (refresh) {
      setLastVisible(null);
    }
    setLoading(true);
    try {
      const favoritesQuery = query(
        collection(firestore, `users/${user.uid}/favorites`),
        orderBy('createdAt', 'desc'),
        limit(10),
        ...(lastVisible ? [startAfter(lastVisible)] : [])
      );
      const querySnapshot = await getDocs(favoritesQuery);
      const newFavorites = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FavoriteItem[];
      setFavorites(refresh ? newFavorites : [...favorites, ...newFavorites]);
      setLastVisible(querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites(true);
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites(true);
  };

  const handleDoubleTap = () => {
    Alert.alert('Double Tap', 'You have already liked the image!');
    setBubbleVisible(false);
  };

  const handleLongPress = (caption: string, x: number, y: number) => {
    setBubbleCaption(caption);
    setBubblePosition({ x: x - 50, y: y - 200 });
    setBubbleVisible(true);
  };

  const renderItem: FlashListProps<FavoriteItem>['renderItem'] = ({ item }: { item: FavoriteItem }) => (
    <GestureHandlerRootView>
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleLongPress(item.caption, nativeEvent.absoluteX, nativeEvent.absoluteY);
          }
        }}
        minDurationMs={800}
      >
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              handleDoubleTap();
            }
          }}
          onActivated={() => setBubbleVisible(false)}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );

  return (
    <ThemedView style={styles.container}>
      {loading && favorites.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlashList<FavoriteItem>
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item: FavoriteItem) => item.id}
          estimatedItemSize={200}
          onEndReached={() => fetchFavorites()}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={() => setBubbleVisible(false)}
        />
      )}
      {bubbleVisible && (
        <View style={[styles.bubble, { top: bubblePosition.y, left: bubblePosition.x }]}>
          <Text style={styles.bubbleText}>{bubbleCaption}</Text>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white"
  },
  imageContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  caption: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    borderRadius: 4,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  bubbleText: {
    color: 'white',
  },
});
