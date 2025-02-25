import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, Image } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { GestureHandlerRootView, LongPressGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/ThemedView';
import placeholderData from '@/assets/placeholder';

interface PlaceholderItem {
  id: string;
  url: string;
  caption: string;
}

export default function HomeScreen() {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const [bubbleCaption, setBubbleCaption] = useState('');

  const handleDoubleTap = () => {
    Alert.alert('Double Tap', 'You liked the image!');
    setBubbleVisible(false);
  };

  const handleLongPress = (caption: string, x: number, y: number) => {
    setBubbleCaption(caption);
    setBubblePosition({ x: x - 50, y: y - 200 });
    setBubbleVisible(true);
  };

  const renderItem: FlashListProps<PlaceholderItem>['renderItem'] = ({ item }: { item: PlaceholderItem }) => (
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
            <Image source={{ uri: item.url }} style={styles.image} />
          </View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlashList<PlaceholderItem>
      data={placeholderData}
      renderItem={renderItem}
      keyExtractor={(item: PlaceholderItem) => item.id}
      estimatedItemSize={200}
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
