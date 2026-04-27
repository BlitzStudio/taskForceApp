import { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAppData } from '../../src/contexts/AppDataContext';
import { getChallengeProgress } from '../../src/utils/periodicChallenges';
import { spacing, radii } from '../../src/theme';

export default function TargetsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { challenges, targets } = useAppData();

  const grouped = useMemo(() => ({
    daily: challenges.filter((c) => c.period === 'daily'),
    weekly: challenges.filter((c) => c.period === 'weekly'),
    monthly: challenges.filter((c) => c.period === 'monthly'),
  }), [challenges]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <Text style={[styles.h1, { color: colors.text }]}>{t('targets.personalTargets')}</Text>
      {targets.length === 0 ? (
        <Text style={{ color: colors.textMuted }}>No personal targets yet.</Text>
      ) : (
        targets.map((tg) => (
          <View key={tg.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{tg.type} ({tg.period})</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{tg.current} / {tg.goal}</Text>
            <Bar value={Math.min(100, (tg.current / tg.goal) * 100)} />
          </View>
        ))
      )}

      <Text style={[styles.h1, { color: colors.text }]}>{t('targets.periodicChallenges')}</Text>
      {(['daily', 'weekly', 'monthly'] as const).map((p) => (
        <View key={p} style={{ gap: spacing.sm }}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{p.toUpperCase()}</Text>
          {grouped[p].map((c) => {
            const pct = getChallengeProgress(c);
            return (
              <View key={c.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Text style={{ fontSize: 24 }}>{c.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{c.title}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>{c.description}</Text>
                  </View>
                  {c.isCompleted && <Text style={{ color: colors.success, fontSize: 18 }}>✓</Text>}
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 6 }}>
                  {c.currentValue} / {c.targetValue}
                </Text>
                <Bar value={pct} />
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

function Bar({ value }: { value: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.barBg, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.barFill, { backgroundColor: colors.primary, width: `${value}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  card: { padding: spacing.md, borderRadius: radii.lg, borderWidth: 1, gap: 6 },
  cardTitle: { fontSize: 14, fontWeight: '600' },
  barBg: { height: 6, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  barFill: { height: '100%' },
});
