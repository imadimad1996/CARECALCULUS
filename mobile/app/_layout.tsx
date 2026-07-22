import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQueueStore } from '../src/store/useQueueStore';
import '../global.css';
import mobileAds from 'react-native-google-mobile-ads';
import * as TrackingTransparency from 'expo-tracking-transparency';

const queryClient = new QueryClient();

export default function RootLayout() {
  const loadQueue = useQueueStore((state) => state.loadQueue);

  useEffect(() => {
    loadQueue();

    (async () => {
      const { status } = await TrackingTransparency.requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Tracking permissions granted.');
      }
      mobileAds()
        .initialize()
        .then(adapterStatuses => {
          console.log('AdMob Initialized!', adapterStatuses);
        });
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a' },
          }}
        >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="calculator/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ehr/smart-paste"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="pricing"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
