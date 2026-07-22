import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Copy, Check, ShieldAlert, BookOpen, UserPlus } from 'lucide-react-native';

interface Props {
  scoreTitle: string;
  scoreValue: string | number;
  interpretation: string;
  severity?: 'normal' | 'warning' | 'emergency';
  guidelineReference?: string;
  dotPhrase?: string;
  onAddToQueue?: () => void;
}

export const ResultCard: React.FC<Props> = ({
  scoreTitle,
  scoreValue,
  interpretation,
  severity = 'normal',
  guidelineReference,
  dotPhrase,
  onAddToQueue,
}) => {
  const [copied, setCopied] = useState(false);

  const severityBg =
    severity === 'emergency'
      ? 'bg-red-950/80 border-red-800'
      : severity === 'warning'
      ? 'bg-amber-950/80 border-amber-800'
      : 'bg-emerald-950/80 border-emerald-800';

  const severityTextColor =
    severity === 'emergency'
      ? 'text-red-400'
      : severity === 'warning'
      ? 'text-amber-400'
      : 'text-emerald-400';

  const handleCopyDotPhrase = async () => {
    if (!dotPhrase) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    await Clipboard.setStringAsync(dotPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <View className={`p-5 rounded-2xl border ${severityBg} mb-5 shadow-lg`}>
      {/* Score Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
          {scoreTitle}
        </Text>
        <View className="bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-700">
          <Text className={`${severityTextColor} text-xs font-bold uppercase`}>
            {severity}
          </Text>
        </View>
      </View>

      {/* Main Big Score */}
      <View className="my-2 flex-row items-baseline space-x-2">
        <Text className="text-white text-4xl font-extrabold">{scoreValue}</Text>
      </View>

      {/* Interpretation */}
      <Text className="text-slate-200 text-sm leading-5 font-medium mb-3">
        {interpretation}
      </Text>

      {/* Guideline Citation */}
      {guidelineReference ? (
        <View className="flex-row items-start space-x-1.5 pt-2 border-t border-slate-800/60 mb-3">
          <BookOpen size={13} color="#94a3b8" style={{ marginTop: 2 }} />
          <Text className="text-slate-400 text-xs italic flex-1">{guidelineReference}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View className="flex-row items-center space-x-2 pt-2 border-t border-slate-800/80">
        {dotPhrase ? (
          <TouchableOpacity
            onPress={handleCopyDotPhrase}
            activeOpacity={0.7}
            className="flex-1 bg-slate-900 py-2.5 px-3 rounded-xl border border-slate-700 flex-row items-center justify-center space-x-1.5"
          >
            {copied ? (
              <>
                <Check size={14} color="#10b981" />
                <Text className="text-emerald-400 text-xs font-bold">DotPhrase Copied!</Text>
              </>
            ) : (
              <>
                <Copy size={14} color="#14b8a6" />
                <Text className="text-brand-300 text-xs font-bold">Copy EHR DotPhrase</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}

        {onAddToQueue ? (
          <TouchableOpacity
            onPress={onAddToQueue}
            activeOpacity={0.7}
            className="bg-brand-600 py-2.5 px-3 rounded-xl flex-row items-center justify-center space-x-1.5"
          >
            <UserPlus size={14} color="#ffffff" />
            <Text className="text-white text-xs font-bold">Add to Shift Queue</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
