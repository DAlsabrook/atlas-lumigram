import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Alert, Image, RefreshControl } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { GestureHandlerRootView, LongPressGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/ThemedView';
import { collection, query, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';

type Post = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: any;
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const [bubbleCaption, setBubbleCaption] = useState('');

  const fetchPosts = async (refresh = false) => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(10),
        ...(refresh ? [] : [startAfter(lastVisible)])
      );
      const querySnapshot = await getDocs(postsQuery);
      const newPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(refresh ? newPosts : [...posts, ...newPosts]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  const handleDoubleTap = () => {
    Alert.alert('Double Tap', 'You liked the image!');
    setBubbleVisible(false);
  };

  const handleLongPress = (caption: string, x: number, y: number) => {
    setBubbleCaption(caption);
    setBubblePosition({ x: x - 50, y: y - 200 });
    setBubbleVisible(true);
  };

  const renderItem: FlashListProps<Post>['renderItem'] = ({ item }: { item: Post }) => (
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
      <FlashList<Post>
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item: Post) => item.id}
        estimatedItemSize={200}
        onEndReached={() => fetchPosts()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={() => setBubbleVisible(false)}
      />
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
