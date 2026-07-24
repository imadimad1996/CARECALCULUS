import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { AlertTriangle, Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Page Not Found' }} />
      <View className="flex-1 bg-slate-950 items-center justify-center p-6">
        <View className="w-16 h-16 rounded-2xl bg-amber-950/80 items-center justify-center border border-amber-800/60 mb-4">
          <AlertTriangle size={32} color="#f59e0b" />
        </View>

        <Text className="text-white text-xl font-bold mb-2 text-center">
          Route Not Found
        </Text>
        <Text className="text-slate-400 text-sm text-center mb-6 max-w-xs leading-5">
          This clinical calculator or screen does not exist or has been relocated.
        </Text>

        <Link href="/(drawer)/(tabs)" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-brand-600 px-5 py-3 rounded-2xl flex-row items-center space-x-2"
          >
            <Home size={18} color="#ffffff" />
            <Text className="text-white text-sm font-bold">Return to Clinical Dashboard</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
