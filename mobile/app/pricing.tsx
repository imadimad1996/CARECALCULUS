import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { PRO_PACKAGES, purchaseProPackage } from '../src/services/purchases';
import { ShieldCheck, Check, Sparkles, X, Lock, Zap } from 'lucide-react-native';
import { AdBanner } from '../src/components/AdBanner';

export default function PricingScreen() {
  const router = useRouter();
  const { isPro, setProStatus } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    const result = await purchaseProPackage(selectedPlan);
    setLoading(false);
    if (result.success) {
      setProStatus(true);
      Alert.alert('Pro Pass Activated!', result.message, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Purchase Error', result.message);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Top Bar */}
      <View className="px-4 pt-12 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-850 items-center justify-center border border-slate-800"
        >
          <X size={18} color="#94a3b8" />
        </TouchableOpacity>
        <Text className="text-white text-base font-bold">CareCalculus Pro</Text>
        <View className="w-9" />
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="items-center my-4">
          <View className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 items-center justify-center mb-3">
            <Sparkles size={30} color="#f59e0b" />
          </View>
          <Text className="text-white text-2xl font-extrabold text-center mb-1">
            Unlock Full Clinical Power
          </Text>
          <Text className="text-slate-400 text-xs text-center px-4 leading-4">
            Designed for ICU, ER, Internal Medicine, and Surgical Clinicians for seamless bedside care.
          </Text>
        </View>

        {/* Pro Features */}
        <View className="bg-slate-850 p-4 rounded-2xl border border-slate-800 mb-5 space-y-3">
          {[
            'Unlimited Offline Access to All 88+ Score Cards',
            'Instant 1-Click EHR DotPhrase Copy (Epic/Cerner)',
            'SQLite Bedside Patient Shift Queue (Encrypted)',
            'Metric SI & US Dual Unit Instant Toggle',
            'Peer-reviewed Guideline Citations (AHA/ESC/SRLF)',
          ].map((feature, idx) => (
            <View key={idx} className="flex-row items-center space-x-2.5">
              <View className="w-5 h-5 rounded-full bg-brand-600/30 items-center justify-center border border-brand-500">
                <Check size={12} color="#14b8a6" />
              </View>
              <Text className="text-slate-200 text-xs font-semibold flex-1">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Option Cards */}
        <View className="space-y-3 mb-6">
          {PRO_PACKAGES.map((pkg) => {
            const isSelected = selectedPlan === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => setSelectedPlan(pkg.id)}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl border flex-row items-center justify-between ${
                  isSelected
                    ? 'bg-brand-950/70 border-brand-500'
                    : 'bg-slate-850 border-slate-800'
                }`}
              >
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2 mb-1">
                    <Text className="text-white text-base font-bold">{pkg.title}</Text>
                    {pkg.discountBadge ? (
                      <View className="bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                        <Text className="text-amber-400 text-[10px] font-bold">
                          {pkg.discountBadge}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text className="text-slate-400 text-xs">Cancel anytime. Google Play Billing.</Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-lg font-extrabold">{pkg.priceString}</Text>
                  <Text className="text-slate-400 text-[10px]">{pkg.period}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.8}
          className="bg-brand-600 py-4 px-6 rounded-2xl items-center justify-center flex-row space-x-2 shadow-lg mb-4"
        >
          <Zap size={18} color="#ffffff" />
          <Text className="text-white text-base font-bold">
            {loading ? 'Processing...' : 'Subscribe Now & Unlock Pro'}
          </Text>
        </TouchableOpacity>

        <Text className="text-slate-500 text-[10px] text-center mb-8">
          Subscriptions will auto-renew unless cancelled at least 24-hours before the end of the current period in your Google Play Store settings.
        </Text>
      </ScrollView>
      <AdBanner />
    </View>
  );
}
