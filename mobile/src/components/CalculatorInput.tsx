import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  onChange,
  unit,
  placeholder = '0',
}) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-1.5">
        <Text className="text-slate-200 text-sm font-semibold">{label}</Text>
        {unit ? <Text className="text-brand-400 text-xs font-bold">{unit}</Text> : null}
      </View>
      <View className="bg-slate-800 rounded-xl border border-slate-700 px-3 py-2.5 flex-row items-center">
        <TextInput
          value={value === 0 ? '' : value.toString()}
          onChangeText={(text) => {
            const num = parseFloat(text);
            onChange(isNaN(num) ? 0 : num);
          }}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          className="flex-1 text-white text-base font-bold"
        />
        {unit ? <Text className="text-slate-400 text-sm ml-2 font-medium">{unit}</Text> : null}
      </View>
    </View>
  );
};

interface RadioGroupProps {
  label: string;
  options: { label: string; value: any; pts?: number }[];
  selectedValue: any;
  onSelect: (val: any) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-slate-200 text-sm font-semibold mb-2">{label}</Text>
      <View className="space-y-2">
        {options.map((opt, idx) => {
          const isSelected = selectedValue === opt.value;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelect(opt.value)}
              activeOpacity={0.7}
              className={`p-3 rounded-xl border flex-row items-center justify-between ${
                isSelected
                  ? 'bg-brand-950/60 border-brand-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? 'text-brand-300 font-bold' : 'text-slate-300'
                }`}
              >
                {opt.label}
              </Text>
              {opt.pts !== undefined ? (
                <View
                  className={`px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-brand-600' : 'bg-slate-700'
                  }`}
                >
                  <Text className="text-white text-xs font-bold">
                    +{opt.pts} {opt.pts === 1 ? 'pt' : 'pts'}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
