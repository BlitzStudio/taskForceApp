import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { radii, spacing } from '../theme';

interface Props { achievement: Achievement; }

export function AchievementBadge({ achievement }: Props) {
  const { colors } = useTheme();
  const locked = !achievement.isUnlocked;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: locked ? 0.5 : 1,
        },
      ]}
    >
      <Text style={styles.icon}>{achievement.icon}</Text>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {achievement.title}
      </Text>
      <Text style={[styles.desc, { color: colors.textMuted }]} numberOfLines={2}>
        {achievement.description}
      </Text>
      {achievement.unlockedAt && (
        <Text style={[styles.date, { color: colors.success }]}>
          ✓ {new Date(achievement.unlockedAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150, padding: spacing.md, borderRadius: radii.lg, borderWidth: 1,
    alignItems: 'center', gap: 4,
  },
  icon: { fontSize: 36 },
  title: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  desc: { fontSize: 11, textAlign: 'center' },
  date: { fontSize: 10, marginTop: 4 },
});
