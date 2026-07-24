import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/Header';
import { CalculatorCard } from '../../../src/components/CalculatorCard';
import { CLINICAL_CALCULATORS_CATALOG } from '../../../src/core/calculators';
import { Search, Filter, X } from 'lucide-react-native';

import { useAppStore } from '../../../src/store/useAppStore';

const SPECIALTIES = [
  'All',
  'Favorites',
  'ICU/CCU',
  'Cardiology',
  'Nephrology',
  'Pulmonology',
  'Hepatology',
  'Emergency',
  'Neurology',
  'Endocrinology',
  'Pharmacology',
];

export default function CalculatorsScreen() {
  const router = useRouter();
  const isFavorite = useAppStore((state) => state.isFavorite);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCatalog = CLINICAL_CALCULATORS_CATALOG.filter((calc) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Favorites'
        ? isFavorite(calc.id)
        : calc.category === activeCategory;
    const matchesSearch =
      calc.title.toLowerCase().includes(search.toLowerCase()) ||
      calc.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
      calc.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-slate-950">
      <Header title="Calculator Catalog" />

      {/* Search Input Bar */}
      <View className="px-4 pt-3 pb-2">
        <View className="bg-slate-900 rounded-2xl border border-slate-800 px-3.5 py-2.5 flex-row items-center">
          <Search size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search 88+ calculators (e.g. MAP, GCS, MELD)..."
            placeholderTextColor="#64748b"
            className="flex-1 ml-2 text-white text-sm font-medium"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Horizontal Specialty Filter Chips */}
      <View className="py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {SPECIALTIES.map((spec) => {
            const isSelected = activeCategory === spec;
            return (
              <TouchableOpacity
                key={spec}
                onPress={() => setActiveCategory(spec)}
                activeOpacity={0.7}
                className={`mr-2 px-3.5 py-1.5 rounded-full border ${
                  isSelected
                    ? 'bg-brand-600 border-brand-500'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {spec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Catalog List */}
      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Showing {filteredCatalog.length} Clinical Tools
          </Text>
        </View>

        {filteredCatalog.map((calc) => (
          <CalculatorCard
            key={calc.id}
            calculator={calc}
            onPress={() => router.push(`/calculator/${calc.id}`)}
          />
        ))}

        {filteredCatalog.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Filter size={32} color="#64748b" className="mb-2" />
            <Text className="text-slate-300 text-base font-bold mb-1">No Calculators Found</Text>
            <Text className="text-slate-500 text-xs text-center">
              Try adjusting your search query or category filter.
            </Text>
          </View>
        ) : null}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
