// filepath: /com.docker.devenvironments.code/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Logout from '@/components/Logout'

import { HapticTab } from '@/components/HapticTab';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerRight: () => <Logout/>,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "home": "home-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "search": "search-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add_post"
        options={{
          title: 'Add Post',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "add": "add-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "heart": "heart-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "person": "person-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/[id]"
        options={{
          title: 'My Profile',
          href: null
        }}
      />
    </Tabs>
  );
}
