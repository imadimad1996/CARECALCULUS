import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAppStore } from '../store/useAppStore';

// Use TestIds for development, replace with real unit IDs for production
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : (Platform.OS === 'ios' ? 'ca-app-pub-3940256099942544~1458002511' : 'ca-app-pub-3940256099942544~3347511713');

export const AdBanner = () => {
  const [isError, setIsError] = useState(false);
  const isPro = useAppStore((state) => state.isPro);

  if (isError || isPro) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.adLabel}>Advertisement</Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // You can configure this based on TrackingTransparency status
        }}
        onAdFailedToLoad={(error) => {
          console.error('Ad failed to load:', error);
          setIsError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  placeholder: {
    height: 0,
  },
  adLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
    alignSelf: 'flex-start',
    paddingLeft: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
