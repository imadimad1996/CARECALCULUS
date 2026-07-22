import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Star, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { CalculatorMeta } from '../core/calculators';
import { useAppStore } from '../store/useAppStore';

interface Props {
  calculator: CalculatorMeta;
  onPress: () => void;
}

export const CalculatorCard: React.FC<Props> = ({ calculator, onPress }) => {
  const { isFavorite, toggleFavorite } = useAppStore();
  const favorite = isFavorite(calculator.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(calculator.id);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-slate-850 p-4 rounded-2xl border border-slate-800 mb-3 shadow-sm flex-row items-center justify-between"
    >
      <View className="flex-1 pr-3">
        {/* Header Tags */}
        <View className="flex-row items-center space-x-2 mb-1.5 flex-wrap">
          <View className="bg-brand-900/60 px-2.5 py-0.5 rounded-md border border-brand-700/50">
            <Text className="text-brand-200 text-xs font-semibold">{calculator.category}</Text>
          </View>
          {calculator.isEmergency ? (
            <View className="bg-red-950/80 px-2 py-0.5 rounded-md border border-red-800/60 flex-row items-center space-x-1">
              <AlertTriangle size={10} color="#ef4444" />
              <Text className="text-red-400 text-xs font-bold">EMERGENCY</Text>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <Text className="text-white text-base font-bold mb-1">
          {calculator.title} ({calculator.abbreviation})
        </Text>

        {/* Summary */}
        <Text className="text-slate-400 text-xs leading-4" numberOfLines={2}>
          {calculator.summary}
        </Text>
      </View>

      {/* Right Controls */}
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          onPress={handleFavoritePress}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700"
        >
          <Star
            size={18}
            color={favorite ? '#f59e0b' : '#64748b'}
            fill={favorite ? '#f59e0b' : 'transparent'}
          />
        </TouchableOpacity>

        <View className="w-8 h-8 rounded-xl bg-slate-800 items-center justify-center border border-slate-700">
          <ChevronRight size={18} color="#94a3b8" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
